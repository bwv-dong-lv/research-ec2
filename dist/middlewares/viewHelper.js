"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyStringAsNull = exports.valueToText = exports.trimQueries = void 0;
// @ts-nocheck
/**
 * ViewHelper Middlewares
 */
const big_js_1 = __importDefault(require("big.js"));
const qs_1 = __importDefault(require("qs"));
const constants_1 = require("../constants");
// import _ from 'lodash';
const moment_1 = __importDefault(require("moment"));
// tslint:disable:no-magic-numbers
const PAGING_DIVISER = 4;
const DEFAULT_PAGELINE = 10;
// tslint:disable-next-line:max-func-body-length
exports.default = async (req, res, next) => {
    res.locals.valueLst = constants_1.valueLst;
    res.locals.messageLst = constants_1.messages;
    res.locals.loginUser = req.user;
    /*
     * ページング
     */
    let maxPageButton = 5;
    if (process.env.MAX_PAGE_BUTTON !== undefined) {
        maxPageButton = parseInt(process.env.MAX_PAGE_BUTTON, 10);
    }
    // tslint:disable-next-line:cyclomatic-complexity
    const newPagination = (totalCount) => {
        let pageLine = DEFAULT_PAGELINE;
        let offset = 0;
        if (req.query.offset) {
            offset = parseInt(req.query.offset, 10);
        }
        if (req.query.pageLine) {
            pageLine = parseInt(req.query.pageLine, 10);
        }
        let html = '';
        if (totalCount > 0) {
            const breakPaging = Math.floor(totalCount / pageLine) > maxPageButton + 2;
            const breakCount = [];
            if (breakPaging) {
                breakCount.push(Math.floor(maxPageButton / PAGING_DIVISER));
                breakCount.push(Math.floor((maxPageButton - 1) / PAGING_DIVISER));
            }
            html += `<div class="dataTables_paginate paging_simple_numbers"><ul class="pagination">`;
            const query = Object.assign({}, req.query);
            query.pageLine = pageLine;
            let href = 'javascript:void(0)';
            let className = ' disabled';
            if (offset !== 0) {
                query.offset = 0;
                href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
                className = '';
            }
            href = 'javascript:void(0)';
            if (offset !== 0) {
                query.offset = offset - pageLine;
                href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
            }
            html += `<li class="paginate_button page-item next${className}"><a class="page-link" href="${href}"><i class="pe-7s-angle-left"></i></a></li>`;
            for (let i = 0; i < totalCount; i += pageLine) {
                const ignoreCondition = (offset >
                    breakCount[0] * pageLine + breakCount[1] * pageLine + pageLine ||
                    i >= breakCount[0] * pageLine + breakCount[1] * pageLine * 2) &&
                    (offset + pageLine <
                        totalCount -
                            breakCount[0] * pageLine -
                            breakCount[1] * pageLine -
                            pageLine ||
                        i <=
                            totalCount -
                                breakCount[0] * pageLine -
                                breakCount[1] * pageLine * 2 -
                                1) &&
                    ((i >= breakCount[0] * pageLine &&
                        i < offset - breakCount[1] * pageLine) ||
                        (i > offset + breakCount[1] * pageLine &&
                            i < totalCount - breakCount[0] * pageLine));
                if (breakPaging && ignoreCondition) {
                    const temp = `<li class="paginate_button page-item disabled"><a class="page-link" href="javascript:void(0)">...</a></li>`;
                    if (html.slice(html.length - temp.length, html.length) !== temp) {
                        // 追加したかどうか確認する
                        html += temp;
                    }
                }
                else {
                    query.offset = i;
                    const queryString = qs_1.default.stringify(query);
                    if (i === offset) {
                        html += `
              <li class="paginate_button page-item active"><a class="page-link" href="javascript:void(0)">${i /
                            pageLine +
                            1}</a></li>
            `;
                    }
                    else {
                        html += `
            <li class="paginate_button page-item"><a class="page-link" href="${req.baseUrl}?${queryString}">${i / pageLine + 1}</a></li>
            `;
                    }
                }
            }
            href = 'javascript:void(0)';
            className = ' disabled';
            if (offset + pageLine < totalCount) {
                query.offset = offset + pageLine;
                href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
                className = '';
            }
            html += `<li class="paginate_button${className} page-item"><a class="page-link" href="${href}"><i class="pe-7s-angle-right"></i></a></li>`;
            href = 'javascript:void(0)';
            if (offset + pageLine < totalCount) {
                query.offset = Math.floor((totalCount - 1) / pageLine) * pageLine;
                href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
            }
            html += `</ul></div>`;
        }
        else {
            html = `
        <div class="paginate-info">
          検索結果はありません。
        </div>
      `;
        }
        return html;
    };
    res.locals.newPagination = newPagination;
    const searchResultCount = (start, end, total) => `${total} 件中 ${start} 件から ${end} 件まで表示`;
    // tslint:disable-next-line:cyclomatic-complexity
    const pagination = (totalCount) => {
        let pageLine = DEFAULT_PAGELINE;
        let offset = 0;
        if (req.query.offset) {
            offset = parseInt(req.query.offset, 10);
        }
        if (req.query.pageLine) {
            pageLine = parseInt(req.query.pageLine, 10);
        }
        let html = '';
        if (totalCount > 0) {
            html = `
      <div class="paginate-info">
        ${searchResultCount((offset + 1).toString(), (offset + pageLine > totalCount
                ? totalCount
                : offset + pageLine).toString(), totalCount.toString())}
      </div>
    `;
            const breakPaging = Math.floor(totalCount / pageLine) > maxPageButton + 2;
            const breakCount = [];
            if (breakPaging) {
                breakCount.push(Math.floor(maxPageButton / PAGING_DIVISER));
                breakCount.push(Math.floor((maxPageButton - 1) / PAGING_DIVISER));
            }
            html += `<div class="dataTables_paginate paging_simple_numbers" style="float: right"><ul class="pagination">`;
            const query = Object.assign({}, req.query);
            query.pageLine = pageLine;
            let href = 'javascript:void(0)';
            let className = ' disabled';
            if (offset !== 0) {
                query.offset = 0;
                href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
                className = '';
            }
            href = 'javascript:void(0)';
            if (offset !== 0) {
                query.offset = offset - pageLine;
                href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
            }
            html += `<li class="paginate_button next${className}"><a href="${href}">${constants_1.labels.PREVIOUS}</a></li>`;
            for (let i = 0; i < totalCount; i += pageLine) {
                const ignoreCondition = (offset >
                    breakCount[0] * pageLine + breakCount[1] * pageLine + pageLine ||
                    i >= breakCount[0] * pageLine + breakCount[1] * pageLine * 2) &&
                    (offset + pageLine <
                        totalCount -
                            breakCount[0] * pageLine -
                            breakCount[1] * pageLine -
                            pageLine ||
                        i <=
                            totalCount -
                                breakCount[0] * pageLine -
                                breakCount[1] * pageLine * 2 -
                                1) &&
                    ((i >= breakCount[0] * pageLine &&
                        i < offset - breakCount[1] * pageLine) ||
                        (i > offset + breakCount[1] * pageLine &&
                            i < totalCount - breakCount[0] * pageLine));
                if (breakPaging && ignoreCondition) {
                    const temp = `<li class="paginate_button disabled"><a href="javascript:void(0)">...</a></li>`;
                    if (html.slice(html.length - temp.length, html.length) !== temp) {
                        // 追加したかどうか確認する
                        html += temp;
                    }
                }
                else {
                    query.offset = i;
                    const queryString = qs_1.default.stringify(query);
                    if (i === offset) {
                        html += `
            <li class="paginate_button active"><a href="javascript:void(0)">${i /
                            pageLine +
                            1}</a></li>
            `;
                    }
                    else {
                        html += `
            <li class="paginate_button"><a href="${req.baseUrl}?${queryString}">${i / pageLine + 1}</a></li>
            `;
                    }
                }
            }
            href = 'javascript:void(0)';
            className = ' disabled';
            if (offset + pageLine < totalCount) {
                query.offset = offset + pageLine;
                href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
                className = '';
            }
            html += `<li class="paginate_button${className}"><a href="${href}">${constants_1.labels.NEXT}</a></li>`;
            href = 'javascript:void(0)';
            if (offset + pageLine < totalCount) {
                query.offset = Math.floor((totalCount - 1) / pageLine) * pageLine;
                href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
            }
            html += `</ul></div>`;
        }
        else {
            html = `
        <div class="paginate-info">
          検索結果はありません。
        </div>
      `;
        }
        return html;
    };
    res.locals.pagination = pagination;
    /*
     * string truncate
     */
    let length = 20;
    if (process.env.MIN_TRUNCATE_LENGTH !== undefined) {
        length = parseInt(process.env.MIN_TRUNCATE_LENGTH, 10);
    }
    const truncate = (s, maxlength) => {
        if (maxlength) {
            if (s !== null && s !== undefined && s.length > maxlength) {
                return `${s.substr(0, maxlength)}...`;
            }
            else {
                return s;
            }
        }
        if (s !== null && s !== undefined && s.length > length) {
            return `${s.substr(0, length)}...`;
        }
        else {
            return s;
        }
    };
    res.locals.truncate = truncate;
    /**
     * nl2br
     */
    function nl2br(str, isXhtml = false) {
        if (str === undefined || str === null) {
            return '';
        }
        const breakTag = isXhtml ? '<br />' : '<br>';
        return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
    }
    res.locals.nl2br = nl2br;
    function addCommaToNumber(x) {
        try {
            const amount = new big_js_1.default(x).toFixed();
            const parts = amount.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (parts[1] !== undefined) {
                parts[1] = parts[1].slice(0, 2);
            }
            return parts.join('.');
        }
        catch (_) {
            return '';
        }
    }
    res.locals.addCommaToNumber = addCommaToNumber;
    /**
     * function to set checkbox checked state based on user's search condition
     * @param searchQuery list of option which user checked when doing search
     * @param optionValue the target checkbox's value, to be check
     * @param isDefault is this checkbox default to be checked
     */
    function isChecked(searchQuery, optionValue, isDefault = false) {
        if (searchQuery === undefined || searchQuery === null) {
            return isDefault ? 'checked' : '';
        }
        else if (searchQuery instanceof Array &&
            searchQuery.indexOf(optionValue) >= 0) {
            return 'checked';
        }
        else if (searchQuery.toString() === optionValue.toString()) {
            return 'checked';
        }
        else {
            return '';
        }
    }
    res.locals.isChecked = isChecked;
    /**
     * function to set dropdownlist selected state based on user's search condition
     * @param searchQuery list of option which user checked when doing search
     * @param optionValue the target option's value, to be check
     * @param isDefault is this option default to be selected
     */
    function isSelected(searchQuery, optionValue, isDefault = false) {
        if (searchQuery === undefined) {
            return isDefault ? 'selected' : '';
        }
        else if (searchQuery instanceof Array &&
            searchQuery.indexOf(optionValue) >= 0) {
            return 'selected';
        }
        else if (searchQuery === optionValue) {
            return 'selected';
        }
        else {
            return '';
        }
    }
    res.locals.isSelected = isSelected;
    /**
     * show/hide sorting icons
     * generate sort href
     */
    function sortHtml(currentSort, sort) {
        const query = Object.assign({}, req.query);
        let href = 'javascript:void(0)';
        // query.offset = 0;
        query.order = sort;
        query.activeOrder = currentSort;
        href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
        if (currentSort === sort) {
            return `style=display:show;color:#000; href=${href}`;
        }
        return `style=display:show;color:#a0a0a0; href=${href}`;
    }
    res.locals.sortHtml = sortHtml;
    /**
     * Setup [件表示] html
     */
    function pageLineHtml(dataCount) {
        if (dataCount === 0) {
            return '';
        }
        const query = Object.assign(Object.assign({}, req.query), { offset: 0, order: undefined, pageLine: undefined });
        const href = `${req.baseUrl}?${qs_1.default.stringify(query)}`;
        const selectedValue = req.query.pageLine;
        return `<label><select style="margin-right:5px;" class="custom-select custom-select-sm form-control form-control-sm" data-href=${JSON.stringify(href)}>
    <option value="10" ${!selectedValue || selectedValue == '10' ? 'selected' : ''}>10</option>
    <option value="25" ${selectedValue == '25' ? 'selected' : ''}>25</option>
    <option value="50" ${selectedValue == '50' ? 'selected' : ''}>50</option>
    <option value="100" ${selectedValue == '100' ? 'selected' : ''}>100</option>
  </select>件表⽰</label>`;
    }
    res.locals.pageLineHtml = pageLineHtml;
    /**
     * Display date under a specific format
     * @param format
     * @param date
     */
    function toStringDate(date, format) {
        format = format || 'YYYY/MM/DD';
        return date ? (0, moment_1.default)(date).format(format) : date;
    }
    res.locals.toStringDate = toStringDate;
    /**
     * Display date-time under a specific format
     * @param format
     * @param date
     */
    function toStringDatetime(date, format) {
        format = format || 'YYYY/MM/DD HH:mm:ss';
        return date ? (0, moment_1.default)(date).format(format) : date;
    }
    res.locals.toStringDatetime = toStringDatetime;
    next();
};
/**
 * trim spaces in search queries
 * @param searchQuery list of search strings
 */
const trimQueries = (searchQuery) => {
    const clone = Object.assign({}, searchQuery);
    for (const key of Object.keys(clone)) {
        if (clone[key]) {
            clone[key] = clone[key].trim();
        }
    }
    return clone;
};
exports.trimQueries = trimQueries;
/**
 * display database field under text instead of its number value
 * 1 -> value 1
 * 2 -> value 2
 * @param value
 * @param valueLst
 */
const valueToText = (value, valueLst) => {
    if (value === null || value === undefined) {
        return value;
    }
    else {
        return valueLst[value];
    }
};
exports.valueToText = valueToText;
/**
 * return null if string is empty
 * @param value string
 */
const emptyStringAsNull = (value) => value.length > 0 ? value : null;
exports.emptyStringAsNull = emptyStringAsNull;
//# sourceMappingURL=viewHelper.js.map