import {AdminCollection, AdminSaveRequest} from '../catalogue/admin-collection.model';
import {toFormValues} from '../form/admin-form';
import {diffValues, deleteEntry, JournalEntry, saveEntry, statusEntry} from './journal-entry';
import {JournalRepository} from './journal.repository';

/**
 * The collection, with every change that goes through it written to the journal once it has succeeded. All the
 * administration screens use the collections, so no way of changing an object can miss the journal.
 * A failure to write the journal never undoes the change: `onFailure` tells the user.
 */
export function journaled(collection: AdminCollection, journal: JournalRepository, onFailure: () => void): AdminCollection {
  const subject = {commission: collection.commission, collection: collection.id, collectionLabel: collection.label};
  const record = async (entry: JournalEntry): Promise<void> => {
    try {
      await journal.log(entry);
    } catch (error) {
      console.error('Unable to write the journal', error);
      onFailure();
    }
  };
  const names = (items: ReadonlyArray<{name: string}>) => items.map(item => item.name);

  // Created from the collection (not spread) so that getters, such as a form built from loaded data, keep working.
  return Object.create(collection, {
    save: {
      value: async (request: AdminSaveRequest): Promise<void> => {
        // What the form showed is read before saving: afterwards the collection's own data has already changed.
        const fields = collection.form.sections.flatMap(section => section.fields);
        const adding = !request.original;
        const before = request.original
          ? (collection.initialValues?.(request.original) ?? toFormValues(request.original.source as unknown as Record<string, unknown>, fields))
          : {};
        const changes = adding ? [] : diffValues(before, request.values, fields);
        if (request.cover) {
          changes.push({field: 'Couverture', before: '—', after: 'Nouvelle image'});
        }
        await collection.save(request);
        if (adding || changes.length) {
          await record(saveEntry(subject, String(request.values['name'] ?? ''), changes, adding));
        }
      },
    },
    remove: {
      value: async (item: Parameters<AdminCollection['remove']>[0]): Promise<void> => {
        await collection.remove(item);
        await record(deleteEntry(subject, [item.name]));
      },
    },
    removeMany: {
      value: async (items: Parameters<AdminCollection['removeMany']>[0]): Promise<void> => {
        await collection.removeMany(items);
        await record(deleteEntry(subject, names(items)));
      },
    },
    setStatus: {
      value: async (items: Parameters<AdminCollection['setStatus']>[0], status: string): Promise<void> => {
        await collection.setStatus(items, status);
        const label = collection.statuses.find(option => option.value === status)?.label ?? status;
        await record(statusEntry(subject, names(items), label));
      },
    },
  }) as AdminCollection;
}
