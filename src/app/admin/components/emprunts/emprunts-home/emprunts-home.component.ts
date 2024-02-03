import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {map, Observable, Subscription} from "rxjs";
import {CseUser} from "../../../../models/users.model";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {UserService} from "../../../../services/firebase/user.service";
import {Borrow, BorrowForUser, BorrowStatus} from "../../../models/borrow.model";
import {BorrowDataService} from "../../../services/borrow-data.service";
import {GamesUtils} from "../../../../models/gamesUtils";
import {Comissions, Game, Ludotheque} from "../../../../models/common.model";
import {Book} from "../../../../models/author.model";
import {Tool} from "../../../../bricolage/models/bricolage.model";
import {ChangeBorrowStatusModalComponent} from "../change-borrow-status/change-borrow-status-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {ConfirmationModal} from "../confirm-return-all-modal/confirmation-modal.component";
import {SonoItem} from "../../../../sonotheque/models/sono.model";

@Component({
    selector: 'app-emprunts-home',
    templateUrl: './emprunts-home.component.html',
    styleUrls: ['./emprunts-home.component.scss']
})
export class EmpruntsHomeComponent implements OnInit, OnDestroy {

    @Input() allBorrows: BorrowForUser;
    @Input() users: Array<CseUser>;
    @Input() ludotheque: Ludotheque;
    @Input() allTools: Tool[];
    @Input() sonoItems: SonoItem[];

    employeeSearch: FormControl<string> = new FormControl<string>('');
    objectSearch: FormControl<string> = new FormControl<string>('');
    filteredOptionsUser$?: Observable<Array<CseUser>>;
    filteredOptionsObject$?: Observable<Array<Game | Tool | Book | SonoItem>>;
    selectedUser?: CseUser;
    displayedColumns = ['borrow', 'name', 'start', 'end', 'status', 'comission', 'id'];
    selectedComission: Comissions = Comissions.LUDOTHEQUE;
    comissions = Comissions;
    selectedObject: Game | Tool | Book | SonoItem;
    dataTableSource: MatTableDataSource<Borrow & { selected: boolean }>;
    selectAllBorrow: boolean;
    borrowAll: boolean;
    private usersSub: Subscription;
    private datasTableSub: Subscription;
    showReturned = false;

    constructor(private borrowService: BorrowDataService,
                private dialog: MatDialog,
                private userService: UserService) {
    }

    ngOnInit() {
        this.filteredOptionsUser$ = this.employeeSearch.valueChanges.pipe(
            map((value) => this._filterUser(value || '', this.users)),
        );
        this.filteredOptionsObject$ = this.objectSearch.valueChanges.pipe(
            map((value) => this._filterObject(value || '',
                this.getObjectsToFilter(this.selectedComission))),
        );
        this.usersSub = this.userService.userList$.subscribe(userList => {
            this.users = userList;
            if (this.selectedUser) {
                const updatedUser = userList.find(user => user.id === this.selectedUser.id);
                this.selectEmployee({option: {value: updatedUser}} as MatAutocompleteSelectedEvent);
            }
        });
    }

    displayUser(user: CseUser): string {
        return user ? `${user.firstName} ${user.lastName}` : '';
    }

    displayObject(obj?: Game | Tool | Book | SonoItem): string {
        if (this.selectedComission === Comissions.BRICOLAGE) {
            const tool = obj as Tool;
            return `${tool.id}: ${tool.name};`
        } else {
            return obj ? `${obj.name}` : '';
        }
    }

    selectEmployee($event: MatAutocompleteSelectedEvent) {
        this.selectedUser = $event.option.value as CseUser;
        this.datasTableSub?.unsubscribe();
        this.datasTableSub = this.borrowService.borrowForUser(this.selectedUser.id).subscribe(
            borrowOfUSer => {
                const tableData =
                    borrowOfUSer
                        .filter(borrow => !!borrow)
                        .map(borrow => Object.assign({selected: false}, borrow));
                this.dataTableSource = new MatTableDataSource(tableData);

                if (!tableData.length) {
                    this.borrowAll = false;
                }
            }
        );
    }

    private _filterUser(value: string | CseUser, userList: Array<CseUser>): Array<CseUser> {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName.toLowerCase();
        return userList.filter((item) => {
            const matchFirstName: boolean = item.firstName.toLowerCase().includes(filterValue);
            const matchLastName: boolean = item.firstName.toLowerCase().includes(filterValue);
            return matchFirstName || matchLastName;
        });
    }

    private _filterObject(value: string | Tool | Book | Game, allObjectCse: Array<Tool | Book | Game | SonoItem>) {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name;
        return allObjectCse.filter((item) => {
            if (this.selectedComission === Comissions.BRICOLAGE) {
                const tool = item as Tool;
                return tool.name.toLowerCase().includes(filterValue) || tool.id.toString() === filterValue;
            }
            return item.name.toLowerCase().includes(filterValue);
        });
    }

    selectObject($event: MatAutocompleteSelectedEvent) {
        this.selectedObject = $event.option.value;
        if (this.selectedUser) {
            this.openBorrowModal();
        }
    }

    public openBorrowModal() {
        if (this.borrowAll && this.selectedUser) {
            this.dataTableSource.data.forEach(borrow =>
                this.borrowService.setBorrow(
                    borrow.item,
                    this.selectedUser,
                    this.selectedComission,
                    BorrowStatus.EMPRUNTE,
                    borrow.startDate,
                    borrow.endDate)
            );
            this.borrowAll = false;
        } else if (this.selectedObject && this.selectedUser) {
            this.dialog.open(ChangeBorrowStatusModalComponent, {
                data: {user: this.selectedUser, object: this.selectedObject, comission: this.selectedComission},
            });
        }
    }

    private getObjectsToFilter(selectedComission: Comissions): Array<Tool | Book | Game | SonoItem> {
        switch (selectedComission) {
            case Comissions.BIBLIOTHEQUE:
                // todo
                return [];
            case Comissions.NAUTISME:
                // todo
                return [];
            case Comissions.PHOTO:
                // todo
                return [];
            case Comissions.SONOTHEQUE:
                return this.sonoItems;
            case Comissions.BRICOLAGE:
                return this.allTools;
            case Comissions.LUDOTHEQUE:
                return [
                    ...GamesUtils.bddGameToLudoGame(this.ludotheque.videoGames.games),
                    ...GamesUtils.bddGameToLudoGame(this.ludotheque.boardGames.games),
                    ...GamesUtils.bddGameToLudoGame(this.ludotheque.outsideGames.games)
                ];
        }
    }

    selectedBorrows(): Array<Borrow & { selected: boolean }> {
        return this.dataTableSource?.data.filter(borrow => borrow.selected);
    }

    confirmReturnSelectedBorrows() {
        const dialogRef = this.dialog.open(ConfirmationModal, {
            maxWidth: "400px",
            data: {confirmText: 'Êtes vous certain de vouloir faire le retour de tous les items ?'}
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                this.returnSelectedBorrows();
                this.selectAllBorrow = false;
            }
        });
    }

    returnSelectedBorrows() {
        this.selectedBorrows().forEach(selectedBorrow => {
            delete selectedBorrow.selected;
            this.borrowService.setReturnForBorrow(this.selectedUser, this.dataTableSource.data, selectedBorrow);
        });
    }

    ngOnDestroy() {
        this.usersSub?.unsubscribe();
        this.datasTableSub?.unsubscribe();
    }

    selectChange() {
        this.borrowAll = this.dataTableSource.data
            .some(obj => obj.status !== BorrowStatus.RESERVED);
    }
}
