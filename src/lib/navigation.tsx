import {
  Baseline,
  PaintBucket,
  Palette,
  Rainbow,
  Triangle,
  SquaresUnite,
  ToolCase,
  Link2,
  FileUp,
  QrCode,
  Type,
  WholeWord,
  Fingerprint,
  FileDown,
  FileBraces,
  Database,
  Image,
} from 'lucide-react';
import { PiPlaceholder } from 'react-icons/pi';
import { TbBrandGolang, TbFileTypeJsx, TbNumber64Small, TbReplace } from 'react-icons/tb';
import { LuFileJson2, LuImageDown } from 'react-icons/lu';
import {
  SiElixir,
  SiGooglebigquery,
  SiJson,
  SiMongoose,
  SiToml,
  SiTypescript,
  SiYaml,
  SiZod,
  SiReact,
  SiRust,
  SiPython,
  SiDart,
  SiSharp,
  SiReadthedocs,
  SiGraphql,
  SiMysql,
  SiCss3,
  SiJavascript,
  SiHtml5,
  SiMarkdown,
  SiJss,
  SiSvg,
  SiSass,
  SiPhp,
} from 'react-icons/si';
import { NavigationManager } from './utils';
import { BsShadows } from 'react-icons/bs';

export const NAVIGATION = new NavigationManager([
  {
    label: 'Color Tools',
    icon: <Palette />,
    items: [
      {
        label: 'Color Picker',
        fullName: 'Color Picker',
        path: '/color-tools/color-picker',
        icon: <PaintBucket />,
        tags: ['Color Shades'],
        summary:
          'Selects, analyzes (HEX, RGB, HSL), and generates color palettes. Quickly creates lighter/darker shades, desaturated versions, and complementary colors.',
      },
      {
        label: 'Gradient Editor',
        fullName: 'Color Gradient Editor',
        path: '/color-tools/gradient-editor',
        icon: <Rainbow />,
        tags: [
          'CSS Gradient',
          'Gradient to Image',
          'Gradient to png',
          'Gradient to jpeg',
          'Gradient to webp',
        ],
        summary:
          'Visual tool to create and preview complex CSS linear and radial gradients. Export options include ready-to-use CSS code or an image file (PNG/JPEG/WEBP)',
      },
      {
        label: 'Contrast Checker',
        fullName: 'Color Contrast Checker',
        path: '/color-tools/contrast-checker',
        icon: <Baseline />,
        sourceUrl: 'https://www.npmjs.com/package/tinycolor2',
        summary:
          'Verifies foreground/background color combinations meet WCAG accessibility standards (AA/AAA). Ensures text legibility for all users.',
      },
    ],
  },

  {
    label: 'CSS Tools',
    icon: <SiCss3 />,
    items: [
      {
        label: 'CSS Triangle',
        path: '/css-tools/css-triangle',
        fullName: 'CSS Triangle Generator',
        icon: <Triangle />,
        summary:
          'Visually creates triangles and arrows using pure CSS borders. Generates lightweight code for tooltips and UI accents, avoiding image files.',
      },
      {
        label: 'CSS Unit Converter',
        path: '/css-tools/css-unit-converter',
        icon: <SquaresUnite />,
        tags: ['px to rem', 'rem to px', 'px to em', 'em to px', 'rem to em', 'em to rem'],
        sourceUrl: 'https://github.com/ArthurArakelyan/css-unit-converter-js',
        summary:
          'Converts CSS measurement units (px, rem, em, vw, vh, etc.) for responsive web design, streamlining calculations.',
      },
      {
        label: 'Smooth Shadow Editor',
        path: '/css-tools/smooth-shadow-editor',
        fullName: 'CSS Smooth Shadow Editor',
        tags: ['Smooth Shadow Generator'],
        icon: <BsShadows />,
        summary:
          'Create layered, smooth CSS box-shadows with live preview, edit color, blur, opacity, distance and layers with Smooth Shadows accurate output.',
      },
    ],
  },

  {
    label: 'Convert',
    icon: <TbReplace />,
    items: [
      {
        label: 'HTML',
        fullName: 'Convert HTML',
        icon: <SiHtml5 />,
        items: [
          {
            label: 'to JSX',
            fullName: 'Convert HTML to JSX',
            path: '/convert/html/jsx',
            icon: <TbFileTypeJsx />,
            summary: `Real-time conversion of complex HTML structures into clean, validated JSX format with instant results.`,
          },
          {
            label: 'to Markdown',
            fullName: 'Convert HTML to Markdown',
            path: '/convert/html/markdown',
            icon: <SiMarkdown />,
            summary: `Real-time conversion of complex HTML structures into clean, validated Markdown format with instant results.`,
          },
        ],
      },
      {
        label: 'SVG',
        fullName: 'Convert SVG',
        icon: <SiSvg />,
        items: [
          {
            label: 'to Optimized SVG',
            fullName: 'Convert SVG to Optimized SVG',
            path: '/convert/svg/optimize',
            icon: <SiSvg />,
            summary: `Quickly optimize your SVG files by removing unnecessary metadata and code comments to significantly reduce file size without losing visual quality.`,
          },
          {
            label: 'to React',
            fullName: 'Convert SVG to React',
            path: '/convert/svg/react',
            icon: <SiReact />,
            summary: `Convert raw SVG markup directly into a functional, reusable React component (JSX code) ready for immediate use in your projects, improving performance.`,
          },
          {
            label: 'to Data URI',
            fullName: 'Convert SVG to Data URI',
            path: '/convert/svg/data-uri',
            summary: `Instantly convert your SVG files into a base64 encoded Data URI string, enabling direct use in CSS backgrounds or HTML attributes to save network requests.`,
            icon: <TbNumber64Small />,
          },
        ],
      },
      {
        label: 'JSON',
        fullName: 'Convert JSON',
        icon: <LuFileJson2 />,
        items: [
          {
            label: 'to JSON Schema',
            fullName: 'Convert JSON to JSON Schema',
            path: '/convert/json/json-schema',
            icon: <SiJson />,
            summary:
              'Automatically generate a comprehensive JSON Schema definition from any provided JSON object with instant results.',
          },
          {
            label: 'to Typescript',
            fullName: 'Convert JSON to Typescript',
            path: '/convert/json/typescript',
            icon: <SiTypescript />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated Typescript interface format with instant results.',
          },
          {
            label: 'to Flow',
            fullName: 'Convert JSON to Flow',
            path: '/convert/json/flow',
            summary:
              'Real-time conversion of complex JSON structures into clean, validated Flow.js format with instant results.',
          },
          {
            label: 'to JSDoc',
            fullName: 'Convert JSON to JSDoc',
            path: '/convert/json/jsdoc',
            icon: <SiReadthedocs />,
            summary:
              'Generate standardized JSDoc comments and structure definitions directly from your JSON data with instant accuracy.',
          },
          {
            label: 'to Zod',
            fullName: 'Convert JSON to Zod',
            path: '/convert/json/zod',
            icon: <SiZod />,
            summary:
              'Quickly generate a Zod schema object from your JSON data structure, ideal for runtime validation.',
          },
          {
            label: 'to React Prop Types',
            fullName: 'Convert JSON to React Prop Types',
            path: '/convert/json/react-prop-types',
            icon: <SiReact />,
            summary:
              'Convert JSON objects into accurate React PropTypes definitions for component validation and type checking.',
          },
          {
            label: 'to C#',
            fullName: 'Convert JSON to C#',
            path: '/convert/json/c-sharp',
            icon: <SiSharp />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated C# class format with instant results.',
          },
          {
            label: 'to Rust',
            fullName: 'Convert JSON to Rust',
            path: '/convert/json/rust',
            icon: <SiRust />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated Rust struct format with instant results.',
          },
          {
            label: 'to Python',
            fullName: 'Convert JSON to Python',
            path: '/convert/json/python',
            icon: <SiPython />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated Python class format with instant results.',
          },
          {
            label: 'to Go',
            fullName: 'Convert JSON to Go',
            path: '/convert/json/go',
            icon: <TbBrandGolang />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated Go struct format with instant results.',
          },
          {
            label: 'to Dart',
            fullName: 'Convert JSON to Dart',
            path: '/convert/json/dart',
            icon: <SiDart />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated Dart format with instant results.',
          },
          {
            label: 'to Elixir',
            fullName: 'Convert JSON to Elixir',
            path: '/convert/json/elixir',
            icon: <SiElixir />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated Elixir format with instant results.',
          },
          {
            label: 'to GraphQL',
            fullName: 'Convert JSON to GraphQL',
            path: '/convert/json/graphql',
            icon: <SiGraphql />,
            summary:
              'Generate GraphQL schema definitions directly from JSON data structures with high fidelity and accuracy.',
          },
          {
            label: 'to MySQL',
            fullName: 'Convert JSON to MySQL',
            path: '/convert/json/mysql',
            icon: <SiMysql />,
            summary:
              'Generate MySQL CREATE TABLE statements and schema definitions directly from your JSON data for databases.',
          },
          {
            label: 'to Mongoose Schema',
            fullName: 'Convert JSON to Mongoose Schema',
            path: '/convert/json/mongoose',
            icon: <SiMongoose />,
            summary:
              'Transform JSON data structures directly into valid Mongoose Schema definitions for Node.js/MongoDB projects.',
          },
          {
            label: 'to BigQuery',
            fullName: 'Convert JSON to BigQuery',
            path: '/convert/json/bigquery',
            icon: <SiGooglebigquery />,
            summary:
              'Transform JSON data into BigQuery SQL syntax suitable for schema definition and data loading with precision.',
          },
          {
            label: 'to TOML',
            fullName: 'Convert JSON to TOML',
            path: '/convert/json/toml',
            icon: <SiToml />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated TOML format with instant results.',
          },
          {
            label: 'to YAML',
            fullName: 'Convert JSON to YAML',
            path: '/convert/json/yaml',
            icon: <SiYaml />,
            summary:
              'Real-time conversion of complex JSON structures into clean, validated YAML format with instant results.',
          },
          {
            label: 'to TOON',
            fullName: 'Convert JSON to TOON',
            path: '/convert/json/toon',
            summary:
              'Real-time conversion of complex JSON structures into clean, validated TOON format with instant results.',
          },
        ],
      },
      {
        label: 'CSS',
        fullName: 'Convert CSS',
        icon: <SiCss3 />,
        items: [
          {
            label: 'to Javascript',
            fullName: 'Convert CSS to Javascript',
            path: '/convert/css/js',
            icon: <SiJavascript />,
            summary:
              'Convert standard CSS rules into JS objects suitable for inline styling or integration into JavaScript environments.',
          },
          {
            label: 'to SCSS',
            fullName: 'Convert CSS to SCSS',
            path: '/convert/css/scss',
            icon: <SiSass />,
            summary:
              'Transform standard CSS files into the dynamic SCSS format, enabling the use of variables, nesting, and mixins.',
          },
        ],
      },
      {
        label: 'SCSS',
        fullName: 'Convert SCSS',
        icon: <SiSass />,
        items: [
          {
            label: 'to CSS',
            fullName: 'Convert SCSS to CSS',
            path: '/convert/scss/css',
            icon: <SiCss3 />,
            summary:
              'Compile dynamic SCSS code into static, production-ready CSS format. Features instant conversion and clean output.',
          },
          {
            label: 'to Javascript',
            fullName: 'Convert SCSS to Javascript',
            path: '/convert/scss/js',
            icon: <SiJavascript />,
            summary:
              'Translate dynamic SCSS variables and rules into usable JavaScript object structures for web applications.',
          },
        ],
      },
      {
        label: 'Typescript',
        fullName: 'Convert Typescript',
        icon: <SiTypescript />,
        items: [
          {
            label: 'to JSON Schema',
            fullName: 'Convert Typescript to JSON Schema',
            path: '/convert/ts/json-schema',
            icon: <SiJson />,
            summary:
              'Automatically generate a comprehensive JSON Schema definition from any provided Typescript interface/type.',
          },
          {
            label: 'to Zod',
            fullName: 'Convert Typescript to Zod',
            path: '/convert/ts/zod',
            icon: <SiZod />,
            summary:
              'Quickly generate a Zod schema object from your existing Typescript interface or type definitions.',
          },
          {
            label: 'to Javascript',
            fullName: 'Convert Typescript to Javascript',
            path: '/convert/ts/javascript',
            icon: <SiJavascript />,
            summary:
              'Automatically translates TypeScript code into equivalent JavaScript code, removing type annotations.',
          },
        ],
      },
      {
        label: 'JSS',
        fullName: 'Convert JSS',
        icon: <SiJss />,
        items: [
          {
            label: 'to CSS',
            fullName: 'Convert JSS to CSS',
            path: '/convert/jss/css',
            icon: <SiCss3 />,
            summary:
              'Instantly translate JavaScript Style Sheets (JSS) into standard CSS code with real-time validation feedback.',
          },
          {
            label: 'to SCSS',
            fullName: 'Convert JSS to SCSS',
            path: '/convert/jss/scss',
            icon: <SiSass />,
            summary:
              'Translate JavaScript Style Sheets (JSS) into the flexible and powerful SCSS syntax for CSS pre-processing.',
          },
        ],
      },
      {
        label: 'TOML',
        fullName: 'Convert TOML',
        icon: <SiToml />,
        items: [
          {
            label: 'to JSON',
            fullName: 'Convert TOML to JSON',
            path: '/convert/toml/json',
            icon: <LuFileJson2 />,
            summary:
              'Real-time conversion of complex TOML structures into clean, validated JSON format with instant results.',
          },
          {
            label: 'to JSON Schema',
            fullName: 'Convert TOML to JSON Schema',
            path: '/convert/toml/jsschema',
            icon: <SiJson />,
            summary:
              'Automatically generate a comprehensive JSON Schema definition from any provided TOML object with instant results.',
          },
          {
            label: 'to YAML',
            fullName: 'Convert TOML to YAML',
            path: '/convert/toml/yaml',
            icon: <SiYaml />,
            summary:
              'Real-time conversion of complex TOML structures into clean, validated YAML format with instant results.',
          },
          {
            label: 'to Typescript',
            fullName: 'Convert TOML to Typescript',
            path: '/convert/toml/ts',
            icon: <SiTypescript />,
            summary:
              'Real-time conversion of complex TOML structures into clean, validated Typescript interface format with instant results.',
          },
          {
            label: 'to JSDoc',
            fullName: 'Convert TOML to JSDoc',
            path: '/convert/toml/jsdoc',
            icon: <SiReadthedocs />,
            summary:
              'Generate standardized JSDoc comments and structure definitions directly from your TOML data with instant accuracy.',
          },
        ],
      },
      {
        label: 'YAML',
        fullName: 'Convert YAML',
        icon: <SiYaml />,
        items: [
          {
            label: 'to JSON',
            fullName: 'Convert YAML to JSON',
            path: '/convert/yaml/json',
            icon: <LuFileJson2 />,
            summary:
              'Real-time conversion of complex YAML structures into clean, validated JSON format with instant results.',
          },
          {
            label: 'to JSON Schema',
            fullName: 'Convert YAML to JSON Schema',
            path: '/convert/yaml/jsschema',
            icon: <SiJson />,
            summary:
              'Automatically generate a comprehensive JSON Schema definition from any provided YAML object with instant results.',
          },
          {
            label: 'to TOML',
            fullName: 'Convert YAML to TOML',
            path: '/convert/yaml/toml',
            icon: <SiToml />,
            summary:
              'Real-time conversion of complex YAML structures into clean, validated TOML format with instant results.',
          },
          {
            label: 'to Typescript',
            fullName: 'Convert YAML to Typescript',
            path: '/convert/yaml/ts',
            icon: <SiTypescript />,
            summary:
              'Real-time conversion of complex YAML structures into clean, validated Typescript interface format with instant results.',
          },
          {
            label: 'to JSDoc',
            fullName: 'Convert YAML to JSDoc',
            path: '/convert/yaml/jsdoc',
            icon: <SiReadthedocs />,
            summary:
              'Generate standardized JSDoc comments and structure definitions directly from your YAML data with instant accuracy.',
          },
        ],
      },
      {
        label: 'PHP',
        fullName: 'Convert PHP',
        icon: <SiPhp />,
        items: [
          {
            label: 'to Serialized Data',
            fullName: 'Convert Data to PHP Serialized Data',
            path: '/convert/php/serialized',
            summary:
              'Converts arrays or objects into a PHP-serialized string for database storage or application data transfer.',
            icon: <SiPhp />,
          },
          {
            label: 'to De-Serialized Data',
            fullName: 'Convert PHP Serialized Data to De-Serialized Data',
            path: '/convert/php/deserialized',
            summary:
              'Restores PHP serialized strings back into readable arrays or objects for easier data manipulation and debugging.',
            icon: <Database />,
          },
        ],
      },
    ],
  },

  {
    label: 'Image Tools',
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image />,
    items: [
      {
        label: 'Placeholder Image Generator',
        path: '/image-tools/placeholder-image-generator',
        tags: ['Dummy Image', 'Mock Image'],
        icon: <PiPlaceholder />,
        summary:
          'Generate custom placeholder images with specific dimensions, colors, and text directly in the browser.',
      },
      {
        label: 'Image Compressor',
        path: '/image-tools/image-compressor',
        tags: ['Image Optimizer', 'Compress PNG', 'Compress JPEG', 'Compress WebP'],
        icon: <LuImageDown />,
        summary:
          'Reduce image file sizes (PNG, JPEG, WebP) without significant loss of quality. Optimize images for faster loading web pages and reduced storage.',
        sourceUrl: 'https://www.npmjs.com/package/compressorjs',
      },
    ],
  },

  {
    label: 'Other Tools',
    icon: <ToolCase />,
    items: [
      {
        label: 'Markdown Editor',
        path: '/other-tools/markdown-editor',
        tags: ['Markdown Viewer', 'Markdown Preview', 'Readme Preview', 'Readme Viewer'],
        summary: `A writing tool for fast, lightweight documentation. Features live preview for instant Markdown rendering, making writing and formatting effortless.`,
        icon: <SiMarkdown />,
      },
      {
        label: 'UUID Generator',
        path: '/other-tools/uuid-generator',
        tags: [
          'Unique ID Generator',
          'Random UUID',
          'Random ID',
          'Time based UUID',
          'Time based ID',
        ],
        sourceUrl: 'https://www.npmjs.com/package/uuid',
        icon: <Fingerprint />,
        summary:
          'Creates universally unique identifiers. Supports modern versions (v1,v3,v4,v5,v6) for various application needs, ensuring global uniqueness.',
      },
      {
        label: 'URL Parser',
        path: '/other-tools/url-parser',
        tags: ['Query params'],
        summary:
          'Breaks down a URL into its core components: protocol, hostname, path, query parameters, and fragment. Ideal for debugging and analysis.',
        icon: <Link2 />,
      },
      {
        label: 'Base64 File / Image Encoder',
        path: '/other-tools/base64-file-encoder',
        tags: [
          'Convert a File to Base64',
          'Convert an Image to Base64',
          'Convert a File to Data URI',
          'Convert an Image to Data URI',
        ],
        icon: <FileUp />,
        summary:
          'Encodes files (images, documents, etc.) into a Base64 string for embedding data directly into HTML/CSS or for easy data transfer.',
      },
      {
        label: 'Base64 File / Image Decoder',
        path: '/other-tools/base64-file-decoder',
        tags: [
          'Convert a Base64 to File',
          'Convert a Base64 to an Image',
          'Convert a Data URI to File',
          'Convert a Data URI to an Image',
        ],
        icon: <FileDown />,
        summary:
          'Converts a Base64 string back into its original binary file/image format for viewing, downloading, or further processing.',
      },
      {
        label: 'QR Code Generator',
        path: '/other-tools/qr-code',
        icon: <QrCode />,
        sourceUrl: 'https://github.com/kozakdenys/qr-code-styling',
        summary:
          'Versatile QR tool: create branded codes with custom logos. Supports URL, WiFi, vCard, SMS, Email, Text, and Geo schemas for seamless user actions.',
      },
      {
        label: 'Lorem Ipsum Generator',
        path: '/other-tools/random-text',
        tags: ['Random Text Generator'],
        icon: <Type />,
        summary:
          'Quickly create industry standard placeholder text for layouts and designs with this custom Lorem Ipsum generator.',
      },
      {
        label: 'Word Counter',
        path: '/other-tools/word-counter',
        tags: ['Sentence Counter', 'Text Counter'],
        icon: <WholeWord />,
        summary:
          'Instantly track word, character, and sentence counts to ensure your writing meets specific length requirements.',
      },
      {
        label: 'JSON Editor',
        path: '/other-tools/json-editor',
        tags: ['JSON Viewer', 'JSON Validator'],
        icon: <FileBraces />,
        sourceUrl: 'https://www.npmjs.com/package/vanilla-jsoneditor',
        summary:
          'A versatile web-based tool to view, edit, and format JSON data with tree view, code editor, and schema validation.',
      },
      {
        label: 'Data Size Converter',
        path: '/other-tools/data-size-converter',
        fullName: 'Data Size Converter',
        tags: ['File Size Converter'],
        icon: <Database />,
        summary: `Converts between various data storage units (bits, bytes, KB, MB, GB, etc.) with support for both 1000 and 1024 base calculations.`,
      },
    ],
  },
]);
