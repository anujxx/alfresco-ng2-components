/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { by, element, ElementFinder, Locator } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { By } from 'selenium-webdriver';
import { DropdownPage } from '../../core/pages/material/dropdown.page';

export class FormFieldsPage {

    formContent = element(by.css('adf-form'));
    refreshButton = element(by.css('div[class*="form-reload-button"] mat-icon'));
    saveButton = element(by.cssContainingText('mat-card-actions[class*="adf-for"] span', 'SAVE'));
    valueLocator: Locator = by.css('input');
    labelLocator: Locator = by.css('label');
    noFormMessage = element(by.css('.adf-empty-content__title'));
    completedTaskNoFormMessage = element(by.css('div[id*="completed-form-message"] p'));
    attachFormButton = element(by.id('adf-attach-form-attach-button'));
    completeButton = element(by.id('adf-form-complete'));
    errorMessage: Locator = by.css('.adf-error-text-container .adf-error-text');

    selectFormDropdown = new DropdownPage(element.all(by.css('.adf-attach-form .mat-select-arrow')).first());

    async setFieldValue(locator: (id: string) => By, field: string, value: string): Promise<void> {
        const fieldElement = element(locator(field));
        await BrowserVisibility.waitUntilElementIsVisible(fieldElement);
        await BrowserActions.clearSendKeys(fieldElement, value);
    }

    async checkWidgetIsVisible(fieldId: string): Promise<void> {
        const fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        await BrowserVisibility.waitUntilElementIsVisible(fieldElement);
    }

    async checkWidgetIsHidden(fieldId: string): Promise<void> {
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        await BrowserVisibility.waitUntilElementIsVisible(hiddenElement);
    }

    async getWidget(fieldId: string): Promise<ElementFinder> {
        const widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        await BrowserVisibility.waitUntilElementIsVisible(widget);
        return widget;
    }

    async getFieldValue(fieldId: string, valueLocatorParam: Locator): Promise<string> {
        const widget = await this.getWidget(fieldId);
        const value = widget.element(valueLocatorParam || this.valueLocator);
        await BrowserVisibility.waitUntilElementIsVisible(value);
        return value.getAttribute('value');
    }

    async getFieldLabel(fieldId: string, labelLocatorParam: Locator): Promise<string> {
        const widget = await this.getWidget(fieldId);
        const label = widget.all(labelLocatorParam || this.labelLocator).first();
        return BrowserActions.getText(label);
    }

    async getFieldErrorMessage(fieldId: string): Promise<string> {
        const widget = await this.getWidget(fieldId);
        const error = widget.element(this.errorMessage);
        return BrowserActions.getText(error);
    }

    async getFieldText(fieldId: string, labelLocatorParam: Locator): Promise<string> {
        const widget = await this.getWidget(fieldId);
        const label = widget.element(labelLocatorParam || this.labelLocator);
        return BrowserActions.getText(label);
    }

    async getFieldPlaceHolder(fieldId: string, locator = 'input'): Promise<string> {
        const placeHolderLocator = element(by.css(`${locator}#${fieldId}`));
        await BrowserVisibility.waitUntilElementIsVisible(placeHolderLocator);
        return placeHolderLocator.getAttribute('data-placeholder');
    }

    async checkFieldValue(locator, field, val): Promise<void> {
        await BrowserVisibility.waitUntilElementHasValue(element(locator(field)), val);
    }

    async refreshForm(): Promise<void> {
        await BrowserActions.click(this.refreshButton);
    }

    async saveForm(): Promise<void> {
        await BrowserActions.click(this.saveButton);
    }

    async noFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.formContent);
    }

    async checkFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.formContent);
    }

    async getNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.noFormMessage);
    }

    async getCompletedTaskNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.completedTaskNoFormMessage);
    }

    async clickOnAttachFormButton(): Promise<void> {
        await BrowserActions.click(this.attachFormButton);
    }

    async selectForm(formName: string): Promise<void> {
        await this.selectFormDropdown.clickDropdown();
        await this.selectFormDropdown.checkOptionsPanelIsDisplayed();
        await this.selectFormDropdown.selectOption(formName);
    }

    async selectFormFromDropDown(formName: string): Promise<void> {
        const formNameElement = element(by.cssContainingText('span', formName));
        await BrowserActions.click(formNameElement);
    }

    async checkWidgetIsReadOnlyMode(fieldId: string): Promise<void> {
        const widget = element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
        const widgetReadOnly = widget.element(by.css('div[class*="adf-readonly"]'));
        await BrowserVisibility.waitUntilElementIsVisible(widgetReadOnly);
    }

    async completeForm(): Promise<void> {
        await BrowserActions.click(this.completeButton);
    }

    async setValueInInputById(fieldId: string, value: string): Promise<void> {
        const input = element(by.id(fieldId));
        await BrowserVisibility.waitUntilElementIsVisible(input);
        await BrowserActions.clearSendKeys(input, value);
    }

    async isCompleteButtonDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isCompleteFormButtonEnabled(): Promise<boolean> {
        return this.completeButton.isEnabled();
    }
}
