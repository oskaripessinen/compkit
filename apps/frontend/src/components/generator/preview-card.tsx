import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Codesandbox } from 'lucide-react';
import { useMemo } from 'react';


const PreviewCard = ({ 
  components, 
  selectedComponent, 
  setSelectedComponent,
  css 
}: { 
  generatedCode: string | null;
  components: Array<{ name: string; code: string }>;
  selectedComponent: number;
  setSelectedComponent: (index: number) => void;
  css?: string;
}) => {
  const currentComponent = components[selectedComponent];
  const previewHtml = useMemo(() => {
    if (!currentComponent) return null;
    const iconImports = Array.from(
      currentComponent.code.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/g)
    )
      .flatMap((match) =>
        match[1]
          .split(",")
          .map((token) => token.trim())
          .filter(Boolean)
      );

    const exportedNames = Array.from(
      currentComponent.code.matchAll(/export\s*\{([^}]+)\}/g)
    )
      .flatMap((match) =>
        match[1]
          .split(",")
          .map((token) => token.trim())
          .filter(Boolean)
      )
      .map((name) => name.replace(/^type\s+/i, ""))
      .map((name) => name.split(/\s+as\s+/i)[0]?.trim() ?? name)
      .filter((name, index, self) => name && self.indexOf(name) === index);
    
    // Clean up the component code for browser rendering
    const jsxCode = currentComponent.code
      // Remove all imports
      .replace(/import\s+type[\s\S]*?from\s+['"][^'"]+['"]\s*;?\s*/g, '')
      .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"]\s*;?\s*/g, '')
      // Remove all exports
      .replace(/export\s+default\s+\w+\s*;?\s*$/gm, '')
      .replace(/export\s*\{[^}]*\}\s*;?\s*$/gm, '')
      .replace(/export\s+\{[^}]+\}\s*;?/g, '')
      .replace(/export\s+type\s+[^;]+;?/g, '')
      .replace(/export\s+interface\s+[^{]+\{[\s\S]*?\}\s*;?/g, '')
      .trim();
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/clsx@2.0.0/dist/clsx.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            card: 'hsl(var(--card))',
            'card-foreground': 'hsl(var(--card-foreground))',
            primary: 'hsl(var(--primary))',
            'primary-foreground': 'hsl(var(--primary-foreground))',
            secondary: 'hsl(var(--secondary))',
            'secondary-foreground': 'hsl(var(--secondary-foreground))',
            accent: 'hsl(var(--accent))',
            'accent-foreground': 'hsl(var(--accent-foreground))',
            destructive: 'hsl(var(--destructive))',
            'destructive-foreground': 'hsl(var(--destructive-foreground))',
            muted: 'hsl(var(--muted))',
            'muted-foreground': 'hsl(var(--muted-foreground))',
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            popover: 'hsl(var(--popover))',
            'popover-foreground': 'hsl(var(--popover-foreground))',
          },
          borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
            xs: 'calc(var(--radius) - 6px)',
          },
          boxShadow: {
            xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
            sm: '0 1px 3px 0 rgba(15, 23, 42, 0.1)',
            md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
            lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
          },
          ringWidth: {
            3: '3px',
          },
          transitionProperty: {
            color: 'color, background-color, border-color, text-decoration-color, fill, stroke',
            spacing: 'margin, padding, gap, inset, space, width, height',
          },
        }
      }
    }
  </script>
  <style>
    ${css ? css.replace(/@tailwind[^;]+;/g, '').replace(/\/\*[^*]*\*\//g, '') : ''}
    
    /* Preview container styles */
    body { 
      margin: 0; 
      padding: 2rem; 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module" data-presets="typescript,react">
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const clsx = window.clsx;

    const cn = (...inputs) => {
      if (clsx) {
        return clsx(...inputs);
      }

      return inputs
        .flat(Infinity)
        .filter(Boolean)
        .map((input) => {
          if (typeof input === 'string') return input;
          if (typeof input === 'object') {
            return Object.entries(input)
              .filter(([, value]) => Boolean(value))
              .map(([key]) => key)
              .join(' ');
          }
          return '';
        })
        .join(' ')
        .trim();
    };

    const normalizeClasses = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value.flatMap(normalizeClasses);
      }
      if (typeof value === 'object') {
        return Object.values(value).flatMap(normalizeClasses);
      }
      return [value];
    };

    const cva = (base = '', config = {}) => {
      const { variants = {}, defaultVariants = {}, compoundVariants = [] } = config;

      return ({ className, ...props } = {}) => {
        const mergedProps = { ...defaultVariants, ...props };
        const classes = [...normalizeClasses(base)];

        Object.entries(variants).forEach(([variantName, variantValues]) => {
          const value = mergedProps[variantName];
          if (value == null) return;
          const variantClass = variantValues?.[value];
          if (variantClass) {
            classes.push(variantClass);
          }
        });

        compoundVariants.forEach((compound) => {
          const { class: compoundClass, ...conditions } = compound;
          const matches = Object.entries(conditions).every(([key, value]) => {
            const current = mergedProps[key];
            return Array.isArray(value) ? value.includes(current) : current === value;
          });

          if (matches && compoundClass) {
            classes.push(compoundClass);
          }
        });

        if (className) {
          classes.push(className);
        }

        return cn(...classes);
      };
    };

    const Slot = React.forwardRef((props, ref) => {
      const { children, ...restProps } = props;
      if (React.isValidElement(children)) {
        return React.cloneElement(children, {
          ...restProps,
          ...children.props,
          ref,
        });
      }
      return children;
    });

    ${jsxCode}

    const iconNames = ${JSON.stringify(iconImports)};
    const exportedNames = ${JSON.stringify(exportedNames)};

    const createIcon = (displayName) => {
      const Icon = React.forwardRef(({ size = 24, strokeWidth = 2, ...rest }, ref) =>
        React.createElement(
          'svg',
          {
            ref,
            role: 'img',
            width: size,
            height: size,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            ...rest,
          },
          React.createElement('circle', { cx: 12, cy: 12, r: 10, opacity: 0.08 })
        )
      );
      Icon.displayName = displayName;
      return Icon;
    };

    iconNames.forEach((name) => {
      if (!window[name]) {
        window[name] = createIcon(name);
      }
    });

    const createPrimitive = (tag) =>
      React.forwardRef((props, ref) => React.createElement(tag, { ref, ...props }));

    const DialogPrimitive = window.DialogPrimitive ?? {
      Root: createPrimitive('div'),
      Trigger: createPrimitive('button'),
      Portal: ({ children }) => children,
      Close: createPrimitive('button'),
      Overlay: createPrimitive('div'),
      Content: createPrimitive('div'),
      Title: createPrimitive('h2'),
      Description: createPrimitive('p'),
    };

    window.cn = cn;
    window.cva = cva;
    window.Slot = Slot;
    window.DialogPrimitive = DialogPrimitive;

    const attachExport = (exportName) => {
      if (!exportName || exportName === 'default') return;
      try {
        const ref = eval(exportName); // eslint-disable-line no-eval
        if (typeof ref !== 'undefined') {
          window[exportName] = ref;
        }
      } catch (error) {
        console.warn('Preview: failed to attach export ' + exportName, error);
      }
    };

    exportedNames.forEach(attachExport);

    try {
      if (typeof ${currentComponent.name} !== 'undefined') {
        window['${currentComponent.name}'] = ${currentComponent.name};
        if (!exportedNames.includes('${currentComponent.name}')) {
          exportedNames.push('${currentComponent.name}');
        }
      }
    } catch (_) {}

    const primaryExportName = exportedNames.includes('${currentComponent.name}')
      ? '${currentComponent.name}'
      : (exportedNames.find((name) => /^[A-Z]/.test(name) && !/Variants$/.test(name)) || '${currentComponent.name}');

    const primaryComponent = window[primaryExportName];

    const renderMissing = (label) =>
      React.createElement(
        'div',
        {
          style: {
            padding: '1.5rem',
            border: '1px dashed hsl(var(--border))',
            borderRadius: 'calc(var(--radius) - 2px)',
            color: 'hsl(var(--muted-foreground))',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            backgroundColor: 'hsla(var(--background), 0.65)',
          },
        },
        'Component "' + label + '" is not exported in this file.'
      );

    const FallbackButton = React.forwardRef(({ children, ...rest }, ref) =>
      React.createElement(
        'button',
        {
          ref,
          className:
            'inline-flex items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground shadow-xs transition-all',
          ...rest,
        },
        children ?? 'Button'
      )
    );

    const previewElements = {
      Button: () => {
        const ButtonComponent = window.Button || (typeof primaryComponent === 'function' ? primaryComponent : null);
        if (!ButtonComponent) return renderMissing('Button');
        return React.createElement(
          'div',
          { className: 'flex w-full max-w-xs flex-col gap-2' },
          React.createElement(ButtonComponent, null, 'Primary'),
          React.createElement(ButtonComponent, { variant: 'secondary' }, 'Secondary'),
          React.createElement(ButtonComponent, { variant: 'outline' }, 'Outline')
        );
      },
      Card: () => {
        const CardComponent = window.Card || (typeof primaryComponent === 'function' ? primaryComponent : null);
        if (!CardComponent) return renderMissing('Card');
        const CardHeader = window.CardHeader;
        const CardTitle = window.CardTitle;
        const CardDescription = window.CardDescription;
        const CardAction = window.CardAction;
        const CardContent = window.CardContent;
        const CardFooter = window.CardFooter;
        const ButtonComponent = window.Button || FallbackButton;

        const titleNode = CardTitle
          ? React.createElement(CardTitle, null, 'Project status')
          : React.createElement('h3', { className: 'text-lg font-semibold text-foreground' }, 'Project status');

        const descriptionNode = CardDescription
          ? React.createElement(CardDescription, null, 'Live metrics for your selected teams.')
          : React.createElement('p', { className: 'text-sm text-muted-foreground' }, 'Live metrics for your selected teams.');

        const actionButton = React.createElement(ButtonComponent, { size: 'sm', variant: 'outline' }, 'Manage');

        const header = CardHeader
          ? React.createElement(
              CardHeader,
              null,
              titleNode,
              descriptionNode,
              CardAction
                ? React.createElement(CardAction, null, actionButton)
                : React.createElement(
                    'div',
                    { className: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end' },
                    actionButton
                  )
            )
          : React.createElement(
              'div',
              { className: 'flex items-start justify-between px-6 pt-6' },
              React.createElement('div', { className: 'space-y-1.5 text-left' }, titleNode, descriptionNode),
              actionButton
            );

        const statItems = [
          { label: 'Active sprints', value: '5', trend: '+1' },
          { label: 'Weekly velocity', value: '62 pts', trend: '+8%' },
          { label: 'Review queue', value: '12 PRs', trend: '-3' },
        ];

        const statRows = statItems.map((item) =>
          React.createElement(
            'div',
            {
              key: item.label,
              className: 'flex items-center justify-between rounded-md border border-dashed border-border/50 px-3 py-2',
            },
            React.createElement('div', null, item.label),
            React.createElement(
              'div',
              { className: 'text-right' },
              React.createElement('div', { className: 'text-foreground font-medium' }, item.value),
              React.createElement('div', { className: 'text-xs text-muted-foreground' }, item.trend)
            )
          )
        );

        const content = CardContent
          ? React.createElement(
              CardContent,
              { className: 'grid gap-4 px-6 pb-6 text-sm text-muted-foreground' },
              ...statRows
            )
          : React.createElement(
              'div',
              { className: 'grid gap-4 px-6 pb-6 text-sm text-muted-foreground' },
              ...statRows
            );

        const footerButtons = [
          React.createElement(ButtonComponent, { key: 'invite', variant: 'secondary', size: 'sm' }, 'Invite'),
          React.createElement(ButtonComponent, { key: 'report', size: 'sm' }, 'View report'),
        ];

        const footer = CardFooter
          ? React.createElement(CardFooter, { className: 'gap-2 px-6 pb-6' }, ...footerButtons)
          : React.createElement('div', { className: 'flex items-center gap-2 px-6 pb-6' }, ...footerButtons);

        return React.createElement(CardComponent, { className: 'w-full max-w-sm space-y-0' }, header, content, footer);
      },
      Input: () => {
        const InputComponent = window.Input || (typeof primaryComponent === 'function' ? primaryComponent : null);
        if (!InputComponent) return renderMissing('Input');
        return React.createElement(
          'div',
          { className: 'flex w-full max-w-sm flex-col gap-2' },
          React.createElement('label', { className: 'text-sm font-medium text-foreground' }, 'Email'),
          React.createElement(InputComponent, {
            placeholder: 'maria@example.com',
            type: 'email',
            defaultValue: '',
          })
        );
      },
      Modal: () => {
        const Dialog = window.Dialog || window.Modal || (typeof primaryComponent === 'function' ? primaryComponent : null);
        const DialogContent = window.DialogContent;
        if (!Dialog || !DialogContent) return renderMissing('Modal');
        const Header = window.DialogHeader;
        const Title = window.DialogTitle;
        const Description = window.DialogDescription;
        const Footer = window.DialogFooter;
        const ButtonComponent = window.Button || FallbackButton;
        return React.createElement(
          Dialog,
          { open: true },
          React.createElement(
            DialogContent,
            { className: 'sm:max-w-md space-y-4' },
            Header
              ? React.createElement(
                  Header,
                  null,
                  Title
                    ? React.createElement(Title, null, 'Invite collaborators')
                    : React.createElement('h3', { className: 'text-lg font-semibold text-foreground' }, 'Invite collaborators'),
                  Description
                    ? React.createElement(Description, null, 'Preview and refine the dialog appearance before shipping.')
                    : React.createElement('p', { className: 'text-sm text-muted-foreground' }, 'Preview and refine the dialog appearance before shipping.')
                )
              : React.createElement(
                  'div',
                  { className: 'space-y-1.5 text-left' },
                  React.createElement('h3', { className: 'text-lg font-semibold text-foreground' }, 'Invite collaborators'),
                  React.createElement('p', { className: 'text-sm text-muted-foreground' }, 'Preview and refine the dialog appearance before shipping.')
                ),
            React.createElement(
              'div',
              { className: 'text-sm text-muted-foreground' },
              'This modal stays open in the sandbox so you can inspect focus and overlay styles.'
            ),
            Footer
              ? React.createElement(
                  Footer,
                  null,
                  React.createElement(ButtonComponent, { variant: 'outline' }, 'Cancel'),
                  React.createElement(ButtonComponent, null, 'Send invites')
                )
              : React.createElement(
                  'div',
                  { className: 'flex justify-end gap-2 pt-4' },
                  React.createElement(ButtonComponent, { variant: 'outline' }, 'Cancel'),
                  React.createElement(ButtonComponent, null, 'Send invites')
                )
          )
        );
      },
      Table: () => {
        const TableComponent = window.Table || (typeof primaryComponent === 'function' ? primaryComponent : null);
        if (!TableComponent) return renderMissing('Table');
        const Header = window.TableHeader || ((props) => React.createElement('thead', props));
        const Body = window.TableBody || ((props) => React.createElement('tbody', props));
        const Footer = window.TableFooter || ((props) => React.createElement('tfoot', props));
        const Row = window.TableRow || ((props) => React.createElement('tr', props));
        const Head = window.TableHead || ((props) => React.createElement('th', props));
        const Cell = window.TableCell || ((props) => React.createElement('td', props));
        const Caption = window.TableCaption || ((props) => React.createElement('caption', props));

        const rows = [
          { team: 'Design', owner: 'Alice', status: 'Active', velocity: '48 pts' },
          { team: 'Frontend', owner: 'Leon', status: 'In review', velocity: '56 pts' },
          { team: 'QA', owner: 'Priya', status: 'Pending', velocity: '58 pts' },
        ];

        const bodyRows = rows.map((row) =>
          React.createElement(
            Row,
            { key: row.team },
            React.createElement(Cell, null, row.team),
            React.createElement(Cell, null, row.owner),
            React.createElement(Cell, null, row.status),
            React.createElement(Cell, { className: 'text-right font-medium' }, row.velocity)
          )
        );

        const caption = Caption
          ? React.createElement(
              Caption,
              { className: 'px-2 text-sm text-muted-foreground' },
              'Sprint health overview'
            )
          : null;

        const footer = React.createElement(
          Footer,
          null,
          React.createElement(
            Row,
            null,
            React.createElement(Cell, { colSpan: 2 }, 'Average velocity'),
            React.createElement(Cell, { className: 'text-right text-muted-foreground' }, 'Across teams'),
            React.createElement(Cell, { className: 'text-right font-semibold' }, '54 pts')
          )
        );

        return React.createElement(
          TableComponent,
          { className: 'w-full max-w-2xl overflow-hidden rounded-lg border border-border/40' },
          caption,
          React.createElement(
            Header,
            null,
            React.createElement(
              Row,
              null,
              React.createElement(Head, null, 'Team'),
              React.createElement(Head, null, 'Owner'),
              React.createElement(Head, null, 'Status'),
              React.createElement(Head, { className: 'text-right' }, 'Velocity')
            )
          ),
          React.createElement(Body, null, ...bodyRows),
          footer
        );
      },
    };

    const renderPreview = (name) => {
      const renderer = previewElements[name];
      if (renderer) {
        const element = renderer();
        if (element) return element;
      }
      if (typeof primaryComponent === 'function') {
        return React.createElement(primaryComponent);
      }
      return renderMissing(name);
    };

    const previewElement = renderPreview('${currentComponent.name}');

    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(previewElement);
    } catch (error) {
      console.error('Render error:', error);
      document.getElementById('root').innerHTML = '<div style="color: red; padding: 20px;">Error: ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
  }, [currentComponent, css]);

  return (
    <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 h-full max-h-[60vh] md:max-h-[550px] ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-border px-4 md:px-5 h-14">
        <div className="flex items-center gap-2">
          <Codesandbox className="size-5" stroke='#a4a4a4' />
          <span className="text-sm font-medium text-foreground">Preview</span>
        </div>
        {components.length > 1 && (
          <Select value={selectedComponent.toString()} onValueChange={(value) => setSelectedComponent(parseInt(value))}>
            <SelectTrigger className="h-8 text-sm border-0 hover:bg-accent/50 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {components.map((comp, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {comp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="flex-1 rounded-b-2xl overflow-hidden bg-card">
        {previewHtml ? (
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-0 bg-card"
            sandbox="allow-scripts"
            title="Component Preview"
            
          />
        ) : (
          <div className="flex items-center justify-center flex-col gap-3 h-full">
            <p className="text-sm text-muted-foreground">Component preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};


export { PreviewCard };