import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import {
    combineAll,
    combineLatest,
    merge,
    switchMap,
    tap,
    withLatestFrom,
    startWith,
    map,
    take,
    debounceTime,
} from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    displayedColumns = ['position', 'name', 'weight', 'symbol'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    filterForm: FormGroup;
    queryParams: Filter;
    loading = false;

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.setupFilter();
        this.initializeFilterValue();
        // this.subscribeToQueryParams();
    }

    setupFilter() {
        this.filterForm = this.fb.group({
            position: [null],
            name: [null],
            weight: [null],
            symbol: [null],
        });

        // this.filterForm.valueChanges.pipe(
        //     merge(this.paginator.page, this.sort.sortChange),
        //     debounceTime(200),
        // ).subscribe(_ => {
        //     this.updateQueryParams();
        // });
    }

    initializeFilterValue() {
        const params = this.activatedRoute.snapshot.queryParams;
        console.log(this.activatedRoute);
        console.log(this.activatedRoute.queryParams.subscribe(x => {
            console.log(x);
        }));
    }

    subscribeToQueryParams() {
        this.activatedRoute.queryParams.subscribe((x: Filter) => {
            this.queryParams = {
                page: Number(x.page),
                pageSize: Number(x.pageSize),
                direction: x.direction,
                sort: x.sort,
            };

            this.refresh();
        });
    }

    updateQueryParams() {
        const params = {
            page: this.paginator.pageIndex + 1,
            pageSize: this.paginator.pageSize,
            sort: this.sort.direction === '' ? undefined : this.sort.active,
            direction: this.sort.direction === '' ? undefined : this.sort.direction,
        };

        const filter = this.filterForm.value;
        const keys = Object.keys(this.filterForm.value);
        keys.forEach(key => {
            if (!params[key] && filter[key]) {
                params[key] = filter[key];
            }
        });

        this.router.navigate([], {
            queryParams: params
        });
    }

    async refresh() {
        this.loading = true;
        this.getData(this.queryParams).subscribe(x => {
            console.log(x);
            this.paginator.length = x.count;
            this.dataSource.data = x.data;
            this.loading = false;
        });
    }

    // MOCK THE DATA
    getData(params: Filter): Observable<{ data: Element[], count: number }> {
        const res = interval(200).pipe(
            take(1),
            map(x => {
                const startIndex = (params.page - 1) * params.pageSize;
                const endIndex = startIndex + params.pageSize;
                const data = ELEMENT_DATA.slice(startIndex, endIndex);
                console.log('getdata params', params);
                return { data, count: ELEMENT_DATA.length };
            })
        );

        return res;
    }
}

export interface Filter {
    page: number;
    pageSize: number;
    sort: string;
    direction: '' | 'asc' | 'desc';
}

export interface Element {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: Element[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
    { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
    { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
    { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
    { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
    { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
    { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
    { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
    { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
    { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
