'use server';

import 'server-only';
import convertHtmlToJsx from 'htmltojsx-too';
import { convertHtmlToMarkdown, ConversionOptions } from 'dom-to-semantic-markdown';
import { load as loadHtml } from 'cheerio';
import { Window } from 'happy-dom';

import { prettifyCode } from './prettify';
import { safeAction } from '../safe-action';

function validateInput(input: string) {
  try {
    const $ = loadHtml(input);

    const bodyContent = $('body').html();

    if (!bodyContent) {
      throw new Error('Input could not be recognized or parsed as HTML content.');
    }

    if (!bodyContent.trim()) {
      throw new Error(
        'Input was parsed but resulted in an empty body (likely non-HTML content or only comments).'
      );
    }
  } catch (err) {
    throw new Error(`Input is not valid HTML. ${(err as Error)?.message || err}`, { cause: err });
  }
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
    win.document.write(input);

    const md = convertHtmlToMarkdown(input, {
      overrideDOMParser: new win.DOMParser() as unknown as ConversionOptions['overrideDOMParser'],
      enableTableColumnTracking: options.enableTableColumnTracking as boolean,
      includeMetaData: options.includeMetaData as 'basic',
    });

    return prettifyCode(md, undefined, 'markdown');
  });
}
