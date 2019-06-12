import { Injector } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';

import {
    PagedListingComponentBase,
    PagedKeywordRequestDto
} from '@shared/paged-listing-component-base';

import {
    ICrudService,
    IEntityDto,
    IEntityDtoBase,
    IPagedResultDto
} from './interface';

/*
 * Base generic class to work with ABP (ASP.NET Boilerplate)
 */
export abstract class CrudComponentBase<TServiceProxy extends 
    ICrudService<TEntityDto, TPrimaryKey, TPagedResultDto, TCreateDto, TUpdateDto>,
    TEntityDto extends IEntityDto<TPrimaryKey>,
    TPrimaryKey,
    TPagedResultDto extends IPagedResultDto<TEntityDto, TPrimaryKey>,
    TCreateDto extends IEntityDtoBase,
    TUpdateDto extends IEntityDto<TPrimaryKey>,
    TCreateDialogComponent,
    TUpdateDialogComponent>
    extends PagedListingComponentBase<TEntityDto> {

    items: TEntityDto[] = [];
    protected _dialog: MatDialog;

    constructor(
        injector: Injector,
        protected _service: TServiceProxy,
        protected _createDialog: ComponentType<TCreateDialogComponent>,
        protected _updateDialog: ComponentType<TUpdateDialogComponent>
    ) {
        super(injector);
        this._dialog = injector.get(MatDialog);
    }

    /**
     * Retrieve all databse entities as DTO
     * @param request used to filter items, like by keyword, with skip and max result count
     */
    list(request: PagedKeywordRequestDto): void {
        this._service.getAll(request)
            .subscribe((result: TPagedResultDto) => {
                this.items = result.items;
            });
    }

    /**
     * Deletes entities from database by id
     * @param item DTO of entity that needs to be deleted
     */
    delete(item: TEntityDto): void {
        this._service
            .delete(item.id)
            .pipe(
                finalize(() => {
                    abp.notify.success(this.l('SuccessfullyDeleted'));
                    this.refresh();
                })
            );
    }

    /**
     * Shows creation dialog for the new entry/item
     */
    create(): void {
        this.showCreateOrEditDialog();
    }

    /**
     * Shows edit dialog for the existing entry/item
     */
    edit(item: TEntityDto): void {
        this.showCreateOrEditDialog(item);
    }

    /**
     * Common logic for showing dialog create or edit
     * @param item If passed item, then opened editing else creation dialog
     */
    private showCreateOrEditDialog(item?: TEntityDto): void {
        let createOrEditDialog;

        // if item was passed then we need to open dialog for editing
        // else open dialog for creation new entity/item
        if (item) {
            createOrEditDialog = this._dialog.open(this._updateDialog, {
                data: item
            });
        } else {
            createOrEditDialog = this._dialog.open(this._createDialog);
        }

        // after closing dialog with saving, need to refresh list of items
        createOrEditDialog.afterClosed().subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }
}
