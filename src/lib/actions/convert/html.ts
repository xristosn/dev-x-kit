'use server';

import 'server-only';
import convertHtmlToJsx from 'htmltojsx-too';
import { convertHtmlToMarkdown, ConversionOptions } from 'dom-to-semantic-markdown';
import { load as loadHtml } from 'cheerio';
import { Window } from 'happy-dom';

import { prettifyCode } from './prettify';
import { safeAction } from '../safe-action';
import { ActionValidationError } from '@/lib/action-error';

function validateInput(input: string) {
  const $ = loadHtml(input);
  const bodyContent = $('body').html();

  if (!bodyContent) throw new ActionValidationError('INVALID_HTML');
  if (!bodyContent.trim()) throw new ActionValidationError('EMPTY_HTML_BODY');
}

export async function htmlToJsx(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    const converter = new convertHtmlToJsx({
      createClass: options.renderAs === '2',
    });

    let result = converter.convert(input.replace('<!DOCTYPE html>', ''));

    if (options.renderAs === '1') result = `export const Component = () => (\n${result.trim()}\n)`;

    return prettifyCode(result, undefined, 'typescript');
  });
}

export async function htmlToMarkdown(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    const win = new Window();
    // happy-dom is a JS-only DOM implementation (no browser script execution).
    // Input has already been validated as HTML via validateInput().
    // Monitor happy-dom security advisories for any future changes.
    win.document.write(input);

    const md = convertHtmlToMarkdown(input, {
      overrideDOMParser: new win.DOMParser() as unknown as ConversionOptions['overrideDOMParser'],
      enableTableColumnTracking: options.enableTableColumnTracking as boolean,
      includeMetaData: options.includeMetaData as 'basic',
    });

    return prettifyCode(md, undefined, 'markdown');
  });
}
