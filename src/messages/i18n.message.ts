import * as fs from 'fs'
import * as mustache from 'mustache';
import { TMPL_LANG_RU } from '../const'


export class I18n {
    protected code: string;
    protected avaliableCode: string[];

    constructor(code?: string) {
        if(code) {
            this.code = code;
        } else {
            this.code = 'en';
        }
        this.avaliableCode = ['en', 'ru'];
    }

    getMessage(tmpl: string) : string {
        let template = tmpl;
        if(this.code === 'ru') {
            template = `${tmpl}-${TMPL_LANG_RU}.html`;
        } else {
            template = `${tmpl}.html`;
        }
        return fs.readFileSync(template).toString()
    }

    render(tmpl: string, context: any = {}) : string {
        const template = this.getMessage(tmpl);
        return mustache.render(template, context);
    }
}