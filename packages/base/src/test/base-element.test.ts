/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {customElement, query} from 'lit-element';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../../test/src/util/helpers';
import {BaseElement} from '../base-element';


@customElement('test-element')
class TestElement extends BaseElement {
  @query('#root') protected mdcRoot!: HTMLElement;

  protected mdcFoundation = undefined;
  protected mdcFoundationClass = undefined;
  protected createAdapter() {
    return {};
  }

  render() {
    return html`
      <input type="text" id="root"></input>
    `;
  }
}

@customElement('custom-focus-element')
class CustomFocusElement extends BaseElement {
  @query('#root') protected mdcRoot!: HTMLElement;
  @query('#indirect') indrectRoot!: HTMLElement;

  protected mdcFoundation = undefined;
  protected mdcFoundationClass = undefined;
  protected createAdapter() {
    return {};
  }

  focus() {
    if (this.indrectRoot) {
      this.indrectRoot.focus();
    }
  }

  render() {
    return html`
      <input type="text" id="root"></input>
      <input type="text" id="indirect"></input>
    `;
  }
}

@customElement('custom-click-element')
class CustomClickElement extends BaseElement {
  @query('#root') protected mdcRoot!: HTMLElement;
  @query('#indirect') protected indrectRoot!: HTMLElement;

  protected mdcFoundation = undefined;
  protected mdcFoundationClass = undefined;
  protected createAdapter() {
    return {};
  }
  protected createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  click() {
    if (this.indrectRoot) {
      this.indrectRoot.click();
    }
  }

  render() {
    return html`
      <input type="text" id="root"></input>
      <input type="text" id="indirect"></input>
    `;
  }
}

const testElement = html`
  <test-element></test-element>
`;

const testFocusElement = html`
  <custom-focus-element></custom-focus-element>
`;

const testClickElement = html`
  <custom-click-element></custom-click-element>
`;

suite('base-element:', () => {
  suite('test-element', () => {
    let fixt: TestFixture;
    let component: TestElement|null;
    let shadowTargetElement: HTMLElement|null;

    setup(async () => {
      fixt = await fixture(testElement);
      component = fixt.root.querySelector('test-element');

      if (component !== null && component.shadowRoot !== null) {
        shadowTargetElement = component.shadowRoot.querySelector('#root');
      }
    });

    test('is an instance of base-element', () => {
      assert.instanceOf(component, BaseElement);
    });

    test('shadowRoot focuses on #root after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.equal(component.shadowRoot.activeElement, shadowTargetElement);
    });
  });

  suite('custom-focus-element', () => {
    let fixt: TestFixture;
    let component: CustomFocusElement|null;
    let shadowIndirectElement: HTMLElement|null;
    let shadowRootElement: HTMLElement|null;

    setup(async () => {
      fixt = await fixture(testFocusElement);
      component = fixt.root.querySelector('custom-focus-element');

      if (component !== null && component.shadowRoot !== null) {
        shadowRootElement = component.shadowRoot.querySelector('#root');
        shadowIndirectElement = component.shadowRoot.querySelector('#indirect');
      }
    });

    test('an instance of BaseElement', () => {
      assert.instanceOf(component, CustomFocusElement);
    });

    test('shadowRoot focuses on #indirect after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowIndirectElement === null) {
        assert.isNotNull(shadowIndirectElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.equal(component.shadowRoot.activeElement, shadowIndirectElement);
    });

    test('shadowRoot does not focus on #root after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowRootElement === null) {
        assert.isNotNull(shadowRootElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.notEqual(component.shadowRoot.activeElement, shadowRootElement);
    });
  });

  suite('custom-click-element', () => {
    let fixt: TestFixture;
    let component: CustomClickElement|null;
    let shadowIndirectElement: HTMLElement|null;
    let shadowRootElement: HTMLElement|null;

    setup(async () => {
      fixt = await fixture(testClickElement);
      component = fixt.root.querySelector('custom-click-element');

      if (component !== null && component.shadowRoot !== null) {
        shadowRootElement = component.shadowRoot.querySelector('#root');
        shadowIndirectElement = component.shadowRoot.querySelector('#indirect');
      }
    });

    test('an instance of BaseElement', () => {
      assert.instanceOf(component, BaseElement);
    });

    test('shadowRoot should not focus on #indirect after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowIndirectElement === null) {
        assert.isNotNull(shadowIndirectElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.notEqual(
          component.shadowRoot.activeElement, shadowIndirectElement);
    });

    test('shadowRoot should not focus on #root after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowRootElement === null) {
        assert.isNotNull(shadowRootElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.notEqual(component.shadowRoot.activeElement, shadowRootElement);
    });
  });
});
