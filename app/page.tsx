"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ModuleId = "bridge" | "react" | "hooks" | "routing" | "forms" | "query" | "architecture" | "testing";
type Confidence = "lost" | "steady" | "solid";
type Track = "fast" | "deep";
type Resource = { kind: "Read" | "Watch" | "Practise"; title: string; url: string; note: string };

type Quiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type Lesson = {
  id: string;
  module: ModuleId;
  title: string;
  eyebrow: string;
  duration: number;
  difficulty: "Core" | "Important" | "Advanced";
  summary: string;
  why: string;
  outcomes: string[];
  concept: string;
  ruby: string;
  react: string;
  watch: string;
  quiz: Quiz;
  tags: string[];
};

const modules: { id: ModuleId; index: string; title: string; subtitle: string; accent: string }[] = [
  { id: "bridge", index: "00", title: "Ruby → TypeScript", subtitle: "Translate what you know", accent: "lime" },
  { id: "react", index: "01", title: "React foundations", subtitle: "Components, props & state", accent: "violet" },
  { id: "hooks", index: "02", title: "Hooks without mystery", subtitle: "Effects, refs & identity", accent: "coral" },
  { id: "routing", index: "03", title: "Routing & URL state", subtitle: "Navigation that survives refresh", accent: "sky" },
  { id: "forms", index: "04", title: "Production forms", subtitle: "React Hook Form patterns", accent: "lime" },
  { id: "query", index: "05", title: "Server state", subtitle: "React Query end-to-end", accent: "violet" },
  { id: "architecture", index: "06", title: "Repo architecture", subtitle: "Contexts, hooks & DTOs", accent: "coral" },
  { id: "testing", index: "07", title: "Test with confidence", subtitle: "Behaviour, not internals", accent: "sky" },
];

const makeQuiz = (question: string, options: string[], answer: number, explanation: string): Quiz => ({
  question,
  options,
  answer,
  explanation,
});

const lessons: Lesson[] = [
  {
    id: "collections-callbacks", module: "bridge", title: "Collections & callbacks", eyebrow: "The familiar doorway", duration: 18, difficulty: "Core",
    summary: "Turn Ruby blocks into typed JavaScript callbacks and render useful collections.",
    why: "React code constantly transforms data with map, filter, find and callbacks. This is the quickest bridge from Ruby into JSX.",
    outcomes: ["Translate blocks into arrow functions", "Read map/filter/find chains", "Recognise expression vs statement bodies"],
    concept: "A callback is just a function passed to another function. JavaScript array methods feel very close to Enumerable; the punctuation changes, but the intent does not.",
    ruby: "paid = invoices\n  .select { |invoice| invoice.paid? }\n  .map { |invoice| invoice.number }",
    react: "const paid = invoices\n  .filter((invoice) => invoice.paid)\n  .map((invoice) => invoice.number);",
    watch: "Braces in an arrow function require an explicit return. `(x) => x.name` returns; `(x) => { x.name }` does not.",
    quiz: makeQuiz("Which callback returns an invoice number?", ["(invoice) => { invoice.number }", "(invoice) => invoice.number", "(invoice) = invoice.number"], 1, "An expression-body arrow function returns the expression automatically."),
    tags: ["JavaScript", "arrays", "map", "filter", "callbacks"],
  },
  {
    id: "types-inference", module: "bridge", title: "Types that help, not hinder", eyebrow: "TypeScript essentials", duration: 24, difficulty: "Core",
    summary: "Use inference, object types and unions to make invalid states harder to represent.",
    why: "Your target repo types props, hooks and API data. You need to read the contracts before you need advanced type wizardry.",
    outcomes: ["Know when inference is enough", "Describe object shapes", "Narrow a union safely"],
    concept: "TypeScript checks shapes before the code runs. Let it infer local values; write explicit types at boundaries such as props, services and API responses.",
    ruby: "Invoice = Data.define(:id, :status)\ninvoice = Invoice.new(id: \"i_1\", status: :paid)",
    react: "type Invoice = {\n  id: string;\n  status: \"draft\" | \"paid\";\n};\n\nconst invoice: Invoice = { id: \"i_1\", status: \"paid\" };",
    watch: "Avoid using `any` to silence uncertainty. Prefer `unknown`, then prove the shape through narrowing or validation.",
    quiz: makeQuiz("Where is an explicit type most valuable?", ["Every local constant", "At API and component boundaries", "Only inside tests"], 1, "Boundaries are where one part of the system makes promises to another."),
    tags: ["TypeScript", "inference", "unions", "interfaces"],
  },
  {
    id: "async-modules", module: "bridge", title: "Modules & async work", eyebrow: "Modern application flow", duration: 22, difficulty: "Important",
    summary: "Follow imports, promises and async/await through a frontend codebase.",
    why: "Services return promises, queries coordinate them, and modules make the architecture navigable.",
    outcomes: ["Read named and default imports", "Handle rejected promises", "Understand that async returns a Promise"],
    concept: "`await` pauses only the current async function, not the browser. A service usually returns a promise; another layer decides when to call it and how to display its states.",
    ruby: "invoice = InvoiceService.fetch(id)\nrender json: invoice",
    react: "export async function fetchInvoice(id: string) {\n  const response = await fetch(`/api/invoices/${id}`);\n  if (!response.ok) throw new Error(\"Request failed\");\n  return response.json();\n}",
    watch: "A `try/catch` around a promise only catches it when you `await` the promise or return its rejection chain.",
    quiz: makeQuiz("What does an async function always return?", ["A callback", "A Promise", "JSON"], 1, "Even `return 3` from an async function becomes a Promise resolved with 3."),
    tags: ["JavaScript", "async", "await", "modules", "services"],
  },
  {
    id: "components-props", module: "react", title: "Components & props", eyebrow: "The unit of composition", duration: 26, difficulty: "Core",
    summary: "Build typed functional components and compose them without accidental coupling.",
    why: "Everything in the repo is a functional component. Props are the contracts joining the UI together.",
    outcomes: ["Type component props", "Pass data and callbacks", "Prefer composition to deep prop drilling"],
    concept: "A component is a function that describes UI for its current props and state. Calling it again produces a new description; React reconciles that description with the screen.",
    ruby: "def invoice_badge(invoice:)\n  tag.span(invoice.status, class: \"badge\")\nend",
    react: "type InvoiceBadgeProps = { status: \"draft\" | \"paid\" };\n\nfunction InvoiceBadge({ status }: InvoiceBadgeProps) {\n  return <span className={`badge badge--${status}`}>{status}</span>;\n}",
    watch: "Do not call components as ordinary functions. Render `<InvoiceBadge />` so React owns its identity and hooks.",
    quiz: makeQuiz("What are props?", ["Mutable component storage", "Inputs passed by a parent", "Global server state"], 1, "Props are read-only inputs. A component requests change by calling a callback, not mutating props."),
    tags: ["React", "components", "props", "composition"],
  },
  {
    id: "render-state", module: "react", title: "Rendering & state", eyebrow: "React’s mental model", duration: 30, difficulty: "Core",
    summary: "Understand snapshots, re-renders, derived values and immutable updates.",
    why: "Most confusing React bugs come from treating state like a mutable instance variable rather than a render snapshot.",
    outcomes: ["Explain a render snapshot", "Update arrays immutably", "Derive rather than duplicate state"],
    concept: "Each render sees a snapshot of state. A setter schedules another render; it does not rewrite the variables in the already-running function.",
    ruby: "@filters[:status] = :paid\n@filtered = invoices.select(&:paid?)",
    react: "const [status, setStatus] = useState<Status>(\"all\");\nconst filtered = invoices.filter((invoice) =>\n  status === \"all\" || invoice.status === status\n);",
    watch: "Do not store `filtered` in state when it can be calculated from invoices and status. Duplicate state drifts out of sync.",
    quiz: makeQuiz("After calling a state setter, the current handler sees…", ["The new value immediately", "Its existing render snapshot", "Undefined"], 1, "The update is used by a future render. Current closures keep their snapshot."),
    tags: ["React", "useState", "rendering", "immutability", "derived state"],
  },
  {
    id: "events-lists", module: "react", title: "Events, conditions & lists", eyebrow: "UI from data", duration: 24, difficulty: "Core",
    summary: "Render collections safely and connect user intent to state changes.",
    why: "Payment and invoice pages are rich in tables, empty states, filters and row actions.",
    outcomes: ["Pass event handlers", "Choose stable list keys", "Model loading/empty/success branches"],
    concept: "JSX lets you embed expressions. Use array transforms for repeated UI and ordinary conditional logic for alternate UI states.",
    ruby: "invoices.each do |invoice|\n  render InvoiceRowComponent.new(invoice:)\nend",
    react: "{invoices.map((invoice) => (\n  <InvoiceRow key={invoice.id} invoice={invoice} />\n))}",
    watch: "An array index is a fragile key when items can move, appear or disappear. Prefer a stable domain ID.",
    quiz: makeQuiz("Why does React need keys?", ["For CSS selectors", "To track item identity between renders", "To sort the array"], 1, "Keys help React match old and new children during reconciliation."),
    tags: ["React", "events", "lists", "keys", "conditional rendering"],
  },
  {
    id: "effects", module: "hooks", title: "Effects & cleanup", eyebrow: "Synchronise with the outside world", duration: 34, difficulty: "Core",
    summary: "Use effects for genuine synchronisation and avoid dependency-array traps.",
    why: "Effects appear heavily in the repo, but using fewer and more focused effects makes code easier to reason about.",
    outcomes: ["Identify an external system", "Write cleanup", "Reason about dependencies and stale closures"],
    concept: "An effect synchronises React with something React does not control: a subscription, browser API, timer or imperative library. It is not a general ‘after render’ workflow engine.",
    ruby: "after_commit :publish_update\n\ndef publish_update\n  Events.publish(self)\nend",
    react: "useEffect(() => {\n  const unsubscribe = payments.subscribe(setPayments);\n  return unsubscribe;\n}, [payments]);",
    watch: "If an effect only calculates a value from props or state, calculate during render instead. Effects that set derived state cause extra renders and drift.",
    quiz: makeQuiz("Which is the best use of an effect?", ["Calculate a filtered array", "Subscribe to a browser event", "Handle a button click"], 1, "Subscriptions connect to an external system and need cleanup when dependencies change or the component unmounts."),
    tags: ["React", "useEffect", "cleanup", "dependencies", "lifecycle"],
  },
  {
    id: "refs", module: "hooks", title: "Refs & persistent values", eyebrow: "Remember without rendering", duration: 24, difficulty: "Important",
    summary: "Use refs for DOM access and values that must persist without causing a re-render.",
    why: "The analytics context in your target repo stores tracking details in refs.",
    outcomes: ["Compare refs with state", "Reference a DOM element", "Store the latest non-visual value"],
    concept: "A ref is a stable object with a mutable `.current`. Changing it does not re-render, so it is ideal for values the UI does not directly display.",
    ruby: "@latest_tracking_details = details",
    react: "const latestDetails = useRef<TrackingDetails>();\nlatestDetails.current = details;\n\nfunction track(name: string) {\n  sendEvent(name, latestDetails.current);\n}",
    watch: "If the screen should update when a value changes, it belongs in state—not only in a ref.",
    quiz: makeQuiz("What happens when ref.current changes?", ["React re-renders", "No render is scheduled", "The component unmounts"], 1, "Refs persist, but React does not observe them for rendering."),
    tags: ["React", "useRef", "DOM", "analytics", "identity"],
  },
  {
    id: "memoisation", module: "hooks", title: "Callbacks, memo & identity", eyebrow: "Optimise deliberately", duration: 30, difficulty: "Important",
    summary: "Know when referential identity matters and when memoisation adds noise.",
    why: "The repo uses useCallback and useMemo; you need to read the intent without applying them automatically.",
    outcomes: ["Explain referential equality", "Memoise expensive calculations", "Stabilise a callback when identity is observable"],
    concept: "`useMemo` caches a calculated value; `useCallback` caches a function reference. Both are useful when identity or calculation cost has a measurable consequence.",
    ruby: "@totals ||= calculate_totals(invoices)",
    react: "const totals = useMemo(\n  () => calculateTotals(invoices),\n  [invoices]\n);",
    watch: "Memoisation has a cognitive and runtime cost. It cannot fix an incorrect effect or a component whose state is in the wrong place.",
    quiz: makeQuiz("useCallback primarily preserves…", ["A function result", "A function reference", "A DOM node"], 1, "useCallback returns the same function identity until a dependency changes."),
    tags: ["React", "useCallback", "useMemo", "performance", "identity"],
  },
  {
    id: "layout-mounted", module: "hooks", title: "Layout effects & mounted guards", eyebrow: "Advanced repo patterns", duration: 26, difficulty: "Advanced",
    summary: "Recognise synchronous layout work and understand the repo’s useStateIfMounted guard.",
    why: "These are patterns to understand in context, not reach for first.",
    outcomes: ["Know why layout effects block paint", "Recognise async cleanup", "Evaluate mounted-state guards critically"],
    concept: "`useLayoutEffect` runs after DOM mutation but before the browser paints. A mounted guard prevents late async callbacks from setting state, though cancellation is often more direct.",
    ruby: "# No direct server-side equivalent:\n# this coordinates with browser layout before paint.",
    react: "useLayoutEffect(() => {\n  const height = panelRef.current?.getBoundingClientRect().height;\n  setHeight(height ?? 0);\n}, []);",
    watch: "Prefer normal effects unless the user would visibly see the wrong layout. For requests, AbortController or library cancellation may express intent better than a mounted flag.",
    quiz: makeQuiz("When is useLayoutEffect justified?", ["For every API call", "When measuring before paint prevents flicker", "For derived values"], 1, "Its special property is blocking paint while synchronous layout work completes."),
    tags: ["React", "useLayoutEffect", "useStateIfMounted", "cleanup"],
  },
  {
    id: "router-navigation", module: "routing", title: "Router navigation", eyebrow: "Pages without reloads", duration: 24, difficulty: "Core",
    summary: "Read route structure and navigate intentionally with React Router v6.",
    why: "Page-level features depend on location, navigation and route parameters.",
    outcomes: ["Read nested routes", "Use navigate and location", "Separate path and query parameters"],
    concept: "The router maps browser locations to component trees. Navigation changes location; React then renders the branch that matches.",
    ruby: "redirect_to invoice_path(invoice)",
    react: "const navigate = useNavigate();\n\nfunction openInvoice(id: string) {\n  navigate(`/invoices/${id}`);\n}",
    watch: "Do not use navigation as a substitute for state. Put data in the URL only when the location should represent it.",
    quiz: makeQuiz("Which hook performs programmatic navigation?", ["useLocation", "useNavigate", "useSearchParams"], 1, "useNavigate returns the navigation function; useLocation reads the current location."),
    tags: ["React Router", "useNavigate", "useLocation", "routes"],
  },
  {
    id: "url-state", module: "routing", title: "The URL as state", eyebrow: "Shareable filters", duration: 34, difficulty: "Important",
    summary: "Encode, parse and update filter state through query parameters.",
    why: "The repo compresses payment and invoice filters into the URL so views survive refresh and can be shared.",
    outcomes: ["Read search params", "Apply safe defaults", "Update params without loops"],
    concept: "URL state is ideal for a view’s navigable identity: filters, sorting, selected tabs and pagination. Parsing is a boundary, so validate instead of trusting strings.",
    ruby: "status = params.fetch(:status, \"all\")\ninvoices = Invoice.where(status:) unless status == \"all\"",
    react: "const [params, setParams] = useSearchParams();\nconst status = params.get(\"status\") ?? \"all\";\n\nsetParams((current) => {\n  current.set(\"status\", \"paid\");\n  return current;\n});",
    watch: "Decide whether an update should push a history entry or replace it. That choice affects the browser Back button.",
    quiz: makeQuiz("What makes good URL state?", ["A modal hover state", "A shareable invoice filter", "A request’s cached response"], 1, "A filter describes a navigable view and should survive refresh."),
    tags: ["React Router", "useSearchParams", "URL state", "filters"],
  },
  {
    id: "navigation-blocking", module: "routing", title: "Navigation blocking", eyebrow: "Protect unfinished work", duration: 22, difficulty: "Advanced",
    summary: "Prevent accidental navigation when a form contains unsaved changes.",
    why: "Custom navigation hooks in the repo protect large payment and invoice forms.",
    outcomes: ["Connect form dirty state", "Distinguish in-app and browser navigation", "Design an accessible confirmation"],
    concept: "Blocking is policy at the boundary between form state and navigation. It should activate only when data is dirty and release after a successful save or reset.",
    ruby: "# Similar intent to warning before abandoning\n# an unsaved server-side form, but enforced in-browser.",
    react: "useBlocker(({ currentLocation, nextLocation }) =>\n  isDirty && currentLocation.pathname !== nextLocation.pathname\n);",
    watch: "A custom router blocker may not cover closing the tab. Browser-level beforeunload behaviour is separate and deliberately limited.",
    quiz: makeQuiz("When should a blocker be active?", ["Whenever the form exists", "Only while meaningful edits are unsaved", "After a successful save"], 1, "Over-blocking trains users to ignore warnings."),
    tags: ["React Router", "forms", "dirty state", "navigation blocker"],
  },
  {
    id: "rhf-basics", module: "forms", title: "React Hook Form foundations", eyebrow: "Model the user’s draft", duration: 32, difficulty: "Core",
    summary: "Build a form with useForm, registration, errors and a reliable submit lifecycle.",
    why: "React Hook Form is central to the target application.",
    outcomes: ["Create typed form values", "Register native inputs", "Read errors and submission state"],
    concept: "React Hook Form keeps input state close to the DOM and exposes a controlled API around validation, dirtiness and submission.",
    ruby: "form_with model: @payment do |form|\n  form.text_field :reference\nend",
    react: "type PaymentValues = { reference: string };\nconst { register, handleSubmit, formState } = useForm<PaymentValues>();\n\n<form onSubmit={handleSubmit(savePayment)}>\n  <input {...register(\"reference\")} />\n</form>",
    watch: "Always provide coherent default values. `undefined` defaults can create controlled/uncontrolled transitions and confusing dirty checks.",
    quiz: makeQuiz("What does handleSubmit do?", ["Calls the API directly", "Validates then calls your valid/invalid handler", "Creates inputs"], 1, "You still own the domain action; handleSubmit coordinates form validation first."),
    tags: ["React Hook Form", "useForm", "forms", "validation"],
  },
  {
    id: "controller", module: "forms", title: "Controller & custom inputs", eyebrow: "Bridge component contracts", duration: 30, difficulty: "Important",
    summary: "Integrate design-system selects, date pickers and custom fields through Controller.",
    why: "The repo heavily uses Controller because reusable UI components do not always expose native input registration.",
    outcomes: ["Wire value/onChange/onBlur", "Forward errors", "Avoid double registration"],
    concept: "Controller adapts React Hook Form’s field contract to a controlled component’s contract. It is an adapter, not a visual component.",
    ruby: "form.collection_select :customer_id, customers, :id, :name",
    react: "<Controller\n  name=\"customerId\"\n  control={control}\n  render={({ field, fieldState }) => (\n    <CustomerSelect {...field} error={fieldState.error?.message} />\n  )}\n/>",
    watch: "Do not spread both `field` and `register(name)` onto the same input. That registers it twice.",
    quiz: makeQuiz("Controller is most useful for…", ["Static text", "A controlled custom select", "A page heading"], 1, "Controller adapts non-native or controlled component APIs to the form."),
    tags: ["React Hook Form", "Controller", "controlled inputs", "components"],
  },
  {
    id: "schema-validation", module: "forms", title: "Schema validation", eyebrow: "Trust boundaries", duration: 28, difficulty: "Important",
    summary: "Express cross-field rules with Zod or Yup and surface useful errors.",
    why: "Payment rules belong in a schema that can describe the whole submission, not scattered event handlers.",
    outcomes: ["Connect a resolver", "Write cross-field validation", "Separate UI messages from domain policy"],
    concept: "A schema parses unknown input into trusted form data. A resolver lets React Hook Form apply the schema consistently.",
    ruby: "validates :amount, numericality: { greater_than: 0 }\nvalidate :amount_cannot_exceed_balance",
    react: "const paymentSchema = z.object({\n  amount: z.number().positive(),\n  invoiceBalance: z.number(),\n}).refine((value) => value.amount <= value.invoiceBalance, {\n  message: \"Amount exceeds balance\", path: [\"amount\"]\n});",
    watch: "Confirm whether the real repo uses Yup, Zod or both before copying syntax. The architectural role is the same; APIs differ.",
    quiz: makeQuiz("Why use a schema resolver?", ["To style inputs", "To centralise parsing and validation", "To cache API responses"], 1, "A schema turns input into trusted, typed data or structured errors."),
    tags: ["React Hook Form", "Zod", "Yup", "schema", "validation"],
  },
  {
    id: "field-arrays", module: "forms", title: "Dynamic field arrays", eyebrow: "Repeatable form sections", duration: 34, difficulty: "Advanced",
    summary: "Add, remove and validate invoice allocation rows with useFieldArray.",
    why: "Dynamic payment allocations are a realistic form-composition challenge.",
    outcomes: ["Use generated field IDs as keys", "Append and remove rows", "Validate array-level constraints"],
    concept: "`useFieldArray` manages stable row identity and operations for repeated form values. Each generated `field.id` belongs to React rendering; your domain ID remains separate.",
    ruby: "accepts_nested_attributes_for :allocations, allow_destroy: true",
    react: "const { fields, append, remove } = useFieldArray({\n  control, name: \"allocations\"\n});\n\n{fields.map((field, index) => (\n  <AllocationRow key={field.id} index={index} onRemove={() => remove(index)} />\n))}",
    watch: "Do not use the array index as the React key. Removing one row can otherwise make input state appear to jump rows.",
    quiz: makeQuiz("Which value should key a field-array row?", ["The current index", "field.id", "The input value"], 1, "React Hook Form generates a stable field.id for rendering identity."),
    tags: ["React Hook Form", "useFieldArray", "dynamic forms", "keys"],
  },
  {
    id: "query-model", module: "query", title: "The server-state model", eyebrow: "A cache, not a fetch hook", duration: 28, difficulty: "Core",
    summary: "Understand queries as cached server-state subscriptions.",
    why: "The repository wraps most API reads with domain-specific React Query hooks.",
    outcomes: ["Separate client and server state", "Read query status", "Avoid copying query data into state"],
    concept: "A query key names a piece of server state; the query function knows how to obtain it. Components subscribe to the cached result and its lifecycle.",
    ruby: "@invoices = InvoiceService.list(filters: params)",
    react: "const invoicesQuery = useQuery({\n  queryKey: [\"invoices\", filters],\n  queryFn: () => invoiceService.list(filters),\n});",
    watch: "The exact pending/loading status names depend on the installed TanStack Query version. Match the repository, not a random tutorial.",
    quiz: makeQuiz("What belongs in a query key?", ["Everything affecting the query result", "Only a random UUID", "The rendered JSX"], 0, "Inputs used by the query function should be represented in the key."),
    tags: ["React Query", "TanStack Query", "useQuery", "server state", "cache"],
  },
  {
    id: "query-keys", module: "query", title: "Query keys & invalidation", eyebrow: "Name the cache", duration: 30, difficulty: "Important",
    summary: "Design predictable key factories and invalidate the right scope.",
    why: "Cache bugs are often naming bugs: missing filters, inconsistent shapes or invalidation that is too broad.",
    outcomes: ["Build hierarchical keys", "Include filter inputs", "Target invalidation"],
    concept: "Hierarchical keys let related data share a prefix. A small key factory prevents components from inventing incompatible cache names.",
    ruby: "Rails.cache.delete_matched(\"invoices/*\")",
    react: "const invoiceKeys = {\n  all: [\"invoices\"] as const,\n  lists: () => [...invoiceKeys.all, \"list\"] as const,\n  list: (filters: Filters) => [...invoiceKeys.lists(), filters] as const,\n};",
    watch: "Objects in query keys must be serialisable and stable in meaning. Do not include functions or UI-only objects.",
    quiz: makeQuiz("After changing an invoice, invalidate…", ["Every query in the app", "The relevant invoice/list key scope", "Nothing; caches update magically"], 1, "Targeted invalidation marks related cached data stale without discarding unrelated work."),
    tags: ["React Query", "query keys", "cache", "invalidation"],
  },
  {
    id: "dependent-queries", module: "query", title: "Conditional & dependent queries", eyebrow: "Fetch when ready", duration: 24, difficulty: "Important",
    summary: "Use enabled to express when enough information exists to run a query.",
    why: "Many repo hooks wait for a customer, account or configuration before fetching.",
    outcomes: ["Express prerequisites", "Avoid non-null assertions", "Design disabled-state UI"],
    concept: "A dependent query has a data prerequisite. `enabled` expresses that state to the query library instead of conditionally calling a hook.",
    ruby: "invoices = Invoice.where(customer_id:) if customer_id.present?",
    react: "const invoices = useQuery({\n  queryKey: [\"invoices\", { customerId }],\n  queryFn: () => invoiceService.forCustomer(customerId!),\n  enabled: Boolean(customerId),\n});",
    watch: "Disabled is not the same as loading. The UI may need an intentional ‘choose a customer first’ state.",
    quiz: makeQuiz("Why not call useQuery inside an if statement?", ["Hooks must be called in a consistent order", "It is slower", "TypeScript forbids if statements"], 0, "Use the enabled option while keeping the hook call unconditional."),
    tags: ["React Query", "enabled", "dependent queries", "useQuery"],
  },
  {
    id: "mutations", module: "query", title: "Mutations & refreshed UI", eyebrow: "Change server state", duration: 34, difficulty: "Important",
    summary: "Coordinate POST/PUT/DELETE operations, feedback and cache refresh.",
    why: "Saving a payment is not finished until the UI and relevant cached views reflect the result.",
    outcomes: ["Use mutate/mutateAsync", "Handle pending/error/success", "Invalidate related queries"],
    concept: "A mutation represents an imperative server change. On success, update or invalidate the affected cache so subscribers receive current data.",
    ruby: "payment = Payments::Create.call(params)\nredirect_to payment_path(payment), notice: \"Saved\"",
    react: "const createPayment = useMutation({\n  mutationFn: paymentService.create,\n  onSuccess: () => {\n    queryClient.invalidateQueries({ queryKey: [\"payments\"] });\n    queryClient.invalidateQueries({ queryKey: [\"invoices\"] });\n  },\n});",
    watch: "Avoid closing the form or showing success before an awaited mutation actually succeeds. Design retry and duplicate-submission behaviour.",
    quiz: makeQuiz("What commonly follows a successful mutation?", ["A relevant cache update/invalidation", "Calling hooks conditionally", "Reloading all JavaScript"], 0, "The cache needs a signal that related server state may now be stale."),
    tags: ["React Query", "useMutation", "invalidation", "API"],
  },
  {
    id: "context", module: "architecture", title: "Context & provider patterns", eyebrow: "Share dependencies carefully", duration: 30, difficulty: "Important",
    summary: "Read createCtx wrappers and design stable provider values.",
    why: "EventTrackingContext and AsyncRenderContext are important repo-specific infrastructure.",
    outcomes: ["Create a safe consumer hook", "Place providers intentionally", "Distinguish context from server cache"],
    concept: "Context lets descendants read a value without threading it through every intermediate component. It is dependency distribution, not automatically a complete state solution.",
    ruby: "Current.analytics = analytics_client",
    react: "const TrackingContext = createContext<Tracking | null>(null);\n\nfunction useTracking() {\n  const value = useContext(TrackingContext);\n  if (!value) throw new Error(\"TrackingProvider is missing\");\n  return value;\n}",
    watch: "A new object/function in a provider value on every render can re-render every consumer. Split contexts or stabilise value identity when it matters.",
    quiz: makeQuiz("Context is best described as…", ["A server-state cache", "A way to distribute a value through a subtree", "A database"], 1, "Context transports a value to descendants; that value may contain state or services."),
    tags: ["React", "Context API", "createContext", "Provider", "createCtx"],
  },
  {
    id: "custom-hooks", module: "architecture", title: "Custom hooks as architecture", eyebrow: "Package behaviour", duration: 30, difficulty: "Important",
    summary: "Extract reusable stateful behaviour while keeping component intent visible.",
    why: "Filters, queries and mutations are expressed through domain-specific hooks throughout the repo.",
    outcomes: ["Compose built-in hooks", "Design a useful return contract", "Keep hooks focused on behaviour"],
    concept: "A custom hook is an ordinary function following hook rules. It packages stateful behaviour; it does not create an independent lifecycle or shared state by itself.",
    ruby: "module PaymentsFilterable\n  def payment_filters = params.slice(:status, :from, :to)\nend",
    react: "function usePaymentsFilter() {\n  const [params, setParams] = useSearchParams();\n  const status = parseStatus(params.get(\"status\"));\n  return { status, setStatus: (next: Status) => updateStatus(params, setParams, next) };\n}",
    watch: "Do not hide every line in a hook. A component should still reveal the important data and actions it depends on.",
    quiz: makeQuiz("Do two calls to a custom hook share state automatically?", ["Yes", "No", "Only in TypeScript"], 1, "Each call composes its own hook state unless the hook reads shared context or an external store."),
    tags: ["React", "custom hooks", "architecture", "filters"],
  },
  {
    id: "services-dtos", module: "architecture", title: "Services, DTOs & data flow", eyebrow: "Protect the UI boundary", duration: 34, difficulty: "Important",
    summary: "Trace API data through services, DTO transformations, query hooks and components.",
    why: "This is the target repository’s central separation-of-concerns pattern.",
    outcomes: ["Assign responsibility to layers", "Transform transport shapes", "Trace one field end-to-end"],
    concept: "Services speak HTTP, DTOs translate transport data, query hooks coordinate server-state behaviour, and components render domain-friendly values.",
    ruby: "class InvoiceSerializer\n  def as_json = { id: invoice.id, total: invoice.total.to_f }\nend",
    react: "type InvoiceResponse = { invoice_id: string; total_pence: number };\ntype Invoice = { id: string; total: number };\n\nfunction toInvoice(dto: InvoiceResponse): Invoice {\n  return { id: dto.invoice_id, total: dto.total_pence / 100 };\n}",
    watch: "Do not let snake_case transport fields leak across the UI. A clear boundary keeps backend changes localised.",
    quiz: makeQuiz("Where should total_pence become total?", ["In every component", "At the DTO/domain boundary", "Inside CSS"], 1, "Transform once at the boundary so UI code receives a consistent domain shape."),
    tags: ["architecture", "services", "DTO", "API", "data flow"],
  },
  {
    id: "analytics-async", module: "architecture", title: "Analytics & async rendering", eyebrow: "Repo-specific infrastructure", duration: 28, difficulty: "Advanced",
    summary: "Understand ref-backed tracking context and portal-style asynchronous rendering.",
    why: "These custom contexts are landmarks in the codebase and combine several earlier concepts.",
    outcomes: ["Keep analytics separate from UI intent", "Transform event detail safely", "Recognise portal/provider ownership"],
    concept: "Infrastructure contexts provide stable capabilities—such as tracking or rendering into a managed host—while components express intent through a small API.",
    ruby: "Analytics.track(\"invoice_opened\", invoice_id: invoice.id)",
    react: "const { track } = useEventTracking();\ntrack(\"invoice_opened\", { invoiceId: invoice.id });",
    watch: "Analytics failures should not break the user’s primary action. Avoid coupling event transport details directly to visual components.",
    quiz: makeQuiz("Why might tracking details live in a ref?", ["They must trigger every render", "The latest details are needed without visual updates", "Refs send network requests"], 1, "A ref can hold the latest non-visual metadata while preserving a stable tracking function."),
    tags: ["Pendo", "analytics", "Context API", "portal", "useRef"],
  },
  {
    id: "rtl", module: "testing", title: "Test observable behaviour", eyebrow: "React Testing Library", duration: 32, difficulty: "Core",
    summary: "Write tests that interact with the UI as a user would.",
    why: "Tests give you a safe way to learn and a safety net when modifying an unfamiliar repo.",
    outcomes: ["Query by accessible role", "Use user-event", "Avoid implementation details"],
    concept: "A resilient component test renders the feature, performs an interaction and asserts what a user can observe. It rarely needs component instances or internal state.",
    ruby: "click_button \"Save payment\"\nexpect(page).to have_text(\"Payment saved\")",
    react: "render(<PaymentForm />);\nawait user.type(screen.getByRole(\"textbox\", { name: /reference/i }), \"INV-42\");\nawait user.click(screen.getByRole(\"button\", { name: /save payment/i }));\nexpect(await screen.findByText(/payment saved/i)).toBeVisible();",
    watch: "`getByTestId` is sometimes useful, but accessible role/name queries usually produce tests closer to real usage and expose accessibility problems.",
    quiz: makeQuiz("Prefer querying a button by…", ["Its internal component name", "Its accessible role and name", "Its useState value"], 1, "Role/name reflects how assistive technology and users identify the control."),
    tags: ["testing", "React Testing Library", "Vitest", "user-event", "accessibility"],
  },
  {
    id: "test-data", module: "testing", title: "Test forms, queries & routing", eyebrow: "Real feature boundaries", duration: 38, difficulty: "Important",
    summary: "Build lightweight providers and mock the service boundary for integrated feature tests.",
    why: "The repo’s interesting behaviour spans router, form and query state—not isolated utility functions.",
    outcomes: ["Create a test wrapper", "Use a fresh query client", "Assert async loading and error states"],
    concept: "Feature tests need the same environmental contracts as production: router, providers and query client. Give each test isolated state and mock at the network/service boundary.",
    ruby: "stub_request(:get, \"/api/invoices\").to_return_json(body: invoices)",
    react: "const queryClient = new QueryClient({\n  defaultOptions: { queries: { retry: false } },\n});\nrender(<InvoicePage />, { wrapper: createAppWrapper(queryClient) });",
    watch: "A shared QueryClient leaks cache between tests. Create a fresh client and disable retries unless retry behaviour is under test.",
    quiz: makeQuiz("Why use a fresh QueryClient per test?", ["For prettier output", "To prevent cache leakage", "To enable JSX"], 1, "Test isolation requires each scenario to start without data cached by another test."),
    tags: ["testing", "React Query", "React Router", "forms", "mocks"],
  },
  {
    id: "trace-change", module: "testing", title: "Trace a production change", eyebrow: "Capstone workflow", duration: 45, difficulty: "Advanced",
    summary: "Add a payment-status filter from URL to service and prove the behaviour with tests.",
    why: "This is the daily skill you actually need: find the right seams, make the smallest coherent change and validate it.",
    outcomes: ["Trace a field across layers", "Choose focused change points", "Build a confidence ladder"],
    concept: "Start from user-visible behaviour, trace inward through page → hook → query key → service → DTO, then return outward through tests. Avoid editing every layer until evidence says it participates.",
    ruby: "# Rails instinct still applies:\n# follow the parameter, contract, query and rendered result.",
    react: "// 1. Parse status from useSearchParams\n// 2. Include it in usePaymentsFilter\n// 3. Include filters in the query key\n// 4. Pass it to paymentService.list\n// 5. Assert URL + visible rows in a feature test",
    watch: "A passing unit test is not the whole confidence story. Type-check, focused feature test, broader suite and a manual path each answer different questions.",
    quiz: makeQuiz("Where should change tracing begin?", ["A random service file", "The required user-visible behaviour", "Renaming every type"], 1, "Start with the outcome, then trace the data and ownership boundaries that produce it."),
    tags: ["capstone", "debugging", "architecture", "testing", "workflow"],
  },
];

const STORAGE_KEY = "react-bridge-progress-v1";

const lessonDocs: Record<string, { title: string; url: string }> = {
  "collections-callbacks": { title: "JavaScript in JSX", url: "https://react.dev/learn/javascript-in-jsx-with-curly-braces" },
  "types-inference": { title: "Using TypeScript with React", url: "https://react.dev/learn/typescript" },
  "async-modules": { title: "TypeScript everyday types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" },
  "components-props": { title: "Passing props to a component", url: "https://react.dev/learn/passing-props-to-a-component" },
  "render-state": { title: "State as a snapshot", url: "https://react.dev/learn/state-as-a-snapshot" },
  "events-lists": { title: "Rendering lists", url: "https://react.dev/learn/rendering-lists" },
  effects: { title: "Synchronizing with Effects", url: "https://react.dev/learn/synchronizing-with-effects" },
  refs: { title: "Referencing values with refs", url: "https://react.dev/learn/referencing-values-with-refs" },
  memoisation: { title: "useMemo reference", url: "https://react.dev/reference/react/useMemo" },
  "layout-mounted": { title: "useLayoutEffect reference", url: "https://react.dev/reference/react/useLayoutEffect" },
  "router-navigation": { title: "React Router routing guide", url: "https://reactrouter.com/start/declarative/routing" },
  "url-state": { title: "useSearchParams API", url: "https://reactrouter.com/api/hooks/useSearchParams" },
  "navigation-blocking": { title: "useBlocker API", url: "https://reactrouter.com/api/hooks/useBlocker" },
  "rhf-basics": { title: "React Hook Form: Get started", url: "https://react-hook-form.com/get-started" },
  controller: { title: "Controller API", url: "https://react-hook-form.com/docs/usecontroller/controller" },
  "schema-validation": { title: "Zod basics", url: "https://zod.dev/basics" },
  "field-arrays": { title: "useFieldArray API", url: "https://react-hook-form.com/docs/usefieldarray" },
  "query-model": { title: "TanStack Query overview", url: "https://tanstack.com/query/latest/docs/framework/react/overview" },
  "query-keys": { title: "Query keys guide", url: "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys" },
  "dependent-queries": { title: "Dependent queries guide", url: "https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries" },
  mutations: { title: "Mutations guide", url: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations" },
  context: { title: "Passing data deeply with context", url: "https://react.dev/learn/passing-data-deeply-with-context" },
  "custom-hooks": { title: "Reusing logic with custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
  "services-dtos": { title: "TypeScript narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
  "analytics-async": { title: "Built-in React Hooks", url: "https://react.dev/reference/react/hooks" },
  rtl: { title: "Testing Library query guide", url: "https://testing-library.com/docs/queries/about" },
  "test-data": { title: "user-event introduction", url: "https://testing-library.com/docs/user-event/intro" },
  "trace-change": { title: "Thinking in React", url: "https://react.dev/learn/thinking-in-react" },
};

const moduleMedia: Record<ModuleId, Resource> = {
  bridge: { kind: "Watch", title: "TypeScript’s official video library", url: "https://www.youtube.com/@TypeScript/videos", note: "Use after the lesson; pick the topic you just met." },
  react: { kind: "Watch", title: "React Conf — talks from the React team", url: "https://www.youtube.com/@ReactConfOfficial", note: "Conference talks build the wider mental model." },
  hooks: { kind: "Watch", title: "React Conf — Hooks and modern React", url: "https://www.youtube.com/@ReactConfOfficial/search?query=hooks", note: "Watch selectively; pause and predict the code." },
  routing: { kind: "Practise", title: "React Router address-book tutorial", url: "https://reactrouter.com/tutorials/address-book", note: "A guided build with real navigation and URL state." },
  forms: { kind: "Watch", title: "React Hook Form video resources", url: "https://react-hook-form.com/resources/videos", note: "Filter for Controller, TypeScript and useFieldArray." },
  query: { kind: "Watch", title: "Learn from the TanStack team", url: "https://tanstack.com/learn", note: "Maintainer-led walkthroughs and hands-on material." },
  architecture: { kind: "Practise", title: "Thinking in React tutorial", url: "https://react.dev/learn/thinking-in-react", note: "Decompose a real UI and decide where state belongs." },
  testing: { kind: "Practise", title: "Testing Playground", url: "https://testing-playground.com/", note: "Paste markup and practise accessible queries." },
};

const practiceLinks: Record<ModuleId, Resource> = {
  bridge: { kind: "Practise", title: "Try the type in TypeScript Playground", url: "https://www.typescriptlang.org/play", note: "Change the types until the compiler teaches you why." },
  react: { kind: "Practise", title: "Open a React + TS workbench", url: "https://stackblitz.com/fork/react-ts", note: "Rebuild the example without copying it." },
  hooks: { kind: "Practise", title: "Open a React + TS workbench", url: "https://stackblitz.com/fork/react-ts", note: "Add logging and observe each render and cleanup." },
  routing: { kind: "Practise", title: "Build a shareable filtered view", url: "https://stackblitz.com/fork/react-ts", note: "Refresh and use Back to prove the URL owns the view." },
  forms: { kind: "Practise", title: "React Hook Form TypeScript examples", url: "https://react-hook-form.com/ts", note: "Fork an official example, then add one business rule." },
  query: { kind: "Practise", title: "TanStack Query examples", url: "https://tanstack.com/query/latest/docs/framework/react/examples/simple", note: "Open the example and inspect cache behaviour." },
  architecture: { kind: "Practise", title: "Open a React + TS workbench", url: "https://stackblitz.com/fork/react-ts", note: "Move behaviour through component → hook → service." },
  testing: { kind: "Practise", title: "Testing Library examples", url: "https://testing-library.com/docs/react-testing-library/example-intro", note: "Write the interaction first, then the assertion." },
};

function resourcesFor(lesson: Lesson): Resource[] {
  const doc = lessonDocs[lesson.id];
  return [
    { kind: "Read", title: doc.title, url: doc.url, note: "Authoritative reference — skim now, revisit at work." },
    moduleMedia[lesson.module],
    practiceLinks[lesson.module],
  ];
}

function labBrief(lesson: Lesson) {
  const actions: Record<ModuleId, string> = {
    bridge: "Model a small invoice response, then deliberately introduce two type errors and fix them without using any.",
    react: "Build the smallest invoice UI that demonstrates this concept. Add one interaction and one empty state.",
    hooks: "Add a render counter and console logs. Predict what runs, interact with it, then explain any surprise in one sentence.",
    routing: "Put a status filter in the URL. Prove it survives refresh and that browser Back restores the previous filter.",
    forms: "Build one slice of a payment-allocation form. Include a valid case, an invalid case and a reset path.",
    query: "Mock a delayed request and show intentional pending, success, empty and error states before adding the happy path.",
    architecture: "Start in one component, then extract only the behaviour named in this lesson. Trace one invoice field across each boundary.",
    testing: "Write a failing behaviour test first, make the smallest implementation pass, then remove one brittle implementation detail.",
  };
  return actions[lesson.module];
}

function LogoMark() {
  return <span className="logo-mark" aria-hidden="true"><span>R</span><i /></span>;
}

function TinyIcon({ children }: { children: React.ReactNode }) {
  return <span className="tiny-icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [view, setView] = useState<"course" | "reference">("course");
  const [screen, setScreen] = useState<"dashboard" | "lesson">("dashboard");
  const [selectedId, setSelectedId] = useState(lessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [confidence, setConfidence] = useState<Record<string, Confidence>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [track, setTrack] = useState<Track>("fast");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ModuleId | "all">("all");
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
        if (saved) {
          setCompleted(Array.isArray(saved.completed) ? saved.completed : []);
          setAnswers(saved.answers ?? {});
          setConfidence(saved.confidence ?? {});
          setDrafts(saved.drafts ?? {});
          setTrack(saved.track === "deep" ? "deep" : "fast");
        }
      } catch {
        // Corrupt local progress should never stop the course from loading.
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed, answers, confidence, drafts, track }));
  }, [completed, answers, confidence, drafts, track, hydrated]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key === "/" && view === "reference" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, [view]);

  const selected = lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0];
  const progress = Math.round((completed.length / lessons.length) * 100);
  const nextLesson = lessons.find((lesson) => !completed.includes(lesson.id)) ?? lessons[lessons.length - 1];

  const filteredReferences = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const inCategory = category === "all" || lesson.module === category;
      const haystack = [lesson.title, lesson.summary, lesson.concept, ...lesson.tags].join(" ").toLowerCase();
      return inCategory && (!needle || haystack.includes(needle));
    });
  }, [query, category]);

  function openLesson(id: string) {
    setSelectedId(id);
    setScreen("lesson");
    setView("course");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleComplete(id: string) {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function completeModule(moduleId: ModuleId) {
    const ids = lessons.filter((lesson) => lesson.module === moduleId).map((lesson) => lesson.id);
    const allDone = ids.every((id) => completed.includes(id));
    setCompleted((current) => allDone ? current.filter((id) => !ids.includes(id)) : Array.from(new Set([...current, ...ids])));
  }

  function resetProgress() {
    if (!window.confirm("Reset lesson completion, quiz answers and confidence feedback?")) return;
    setCompleted([]);
    setAnswers({});
    setConfidence({});
    setDrafts({});
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => { setView("course"); setScreen("dashboard"); }} aria-label="React Bridge home">
          <LogoMark />
          <span><strong>react</strong><b>bridge</b></span>
        </button>

        <nav className="primary-nav" aria-label="Primary navigation">
          <button className={view === "course" ? "active" : ""} onClick={() => { setView("course"); setScreen("dashboard"); }}>
            <TinyIcon>⌁</TinyIcon><span>Course</span><small>{progress}%</small>
          </button>
          <button className={view === "reference" ? "active" : ""} onClick={() => setView("reference")}>
            <TinyIcon>⌕</TinyIcon><span>Reference</span><kbd>/</kbd>
          </button>
        </nav>

        <div className="sidebar-label">Your curriculum</div>
        <nav className="module-nav" aria-label="Course modules">
          {modules.map((module) => {
            const moduleLessons = lessons.filter((lesson) => lesson.module === module.id);
            const done = moduleLessons.filter((lesson) => completed.includes(lesson.id)).length;
            return (
              <button key={module.id} onClick={() => { setView("course"); setScreen("dashboard"); document.getElementById(`module-${module.id}`)?.scrollIntoView({ behavior: "smooth" }); }}>
                <span className={`module-dot ${module.accent}`} />
                <span>{module.title}</span>
                <small>{done}/{moduleLessons.length}</small>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="ruby-pill"><span>◆</span><div><small>Learning lens</small><strong>Ruby developer</strong></div></div>
          <button className="reset" onClick={resetProgress}>Reset progress</button>
        </div>
      </aside>

      <main className="main">
        {view === "reference" ? (
          <ReferenceView
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            results={filteredReferences}
            referenceId={referenceId}
            setReferenceId={setReferenceId}
            openLesson={openLesson}
            completed={completed}
            searchRef={searchRef}
          />
        ) : screen === "lesson" ? (
          <LessonView
            lesson={selected}
            completed={completed.includes(selected.id)}
            answer={answers[selected.id]}
            confidence={confidence[selected.id]}
            draft={drafts[selected.id]}
            onAnswer={(answer) => setAnswers((current) => ({ ...current, [selected.id]: answer }))}
            onConfidence={(value) => setConfidence((current) => ({ ...current, [selected.id]: value }))}
            onDraft={(value) => setDrafts((current) => ({ ...current, [selected.id]: value }))}
            onComplete={() => toggleComplete(selected.id)}
            onBack={() => setScreen("dashboard")}
            onNext={() => {
              const index = lessons.findIndex((lesson) => lesson.id === selected.id);
              openLesson(lessons[Math.min(index + 1, lessons.length - 1)].id);
            }}
          />
        ) : (
          <Dashboard
            progress={progress}
            completed={completed}
            nextLesson={nextLesson}
            track={track}
            setTrack={setTrack}
            openLesson={openLesson}
            completeModule={completeModule}
            confidence={confidence}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({ progress, completed, nextLesson, track, setTrack, openLesson, completeModule, confidence }: {
  progress: number;
  completed: string[];
  nextLesson: Lesson;
  track: Track;
  setTrack: (track: Track) => void;
  openLesson: (id: string) => void;
  completeModule: (id: ModuleId) => void;
  confidence: Record<string, Confidence>;
}) {
  const weakCount = Object.values(confidence).filter((value) => value === "lost").length;
  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="breadcrumb"><span>Course</span><i>›</i><strong>Dashboard</strong></div>
        <div className="track-switch" role="group" aria-label="Learning pace">
          <button className={track === "fast" ? "active" : ""} onClick={() => setTrack("fast")}>Fast track</button>
          <button className={track === "deep" ? "active" : ""} onClick={() => setTrack("deep")}>Deep dive</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="kicker"><i /> REPO-READY REACT</span>
          <h1>From Ruby instincts<br />to <em>React confidence.</em></h1>
          <p>A focused, practical path through the exact TypeScript and React patterns you’ll meet in payments and invoices.</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => openLesson(nextLesson.id)}>{progress ? "Continue learning" : "Start the bridge"}<span>→</span></button>
            <div className="pace-note"><span>{track === "fast" ? "~20" : "~32"} hrs</span><small>{track === "fast" ? "Essentials first" : "Examples + deeper context"}</small></div>
          </div>
        </div>
        <div className="hero-progress">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{progress}<sup>%</sup></strong><span>course complete</span></div>
          </div>
          <div className="float-chip chip-one"><span>✓</span>{completed.length} lessons</div>
          <div className="float-chip chip-two"><span>↗</span>{weakCount ? `${weakCount} to revisit` : "Adaptive path"}</div>
        </div>
      </section>

      <section className="continue-card">
        <div className="continue-index">NEXT</div>
        <div className="continue-copy"><span>{nextLesson.eyebrow}</span><h2>{nextLesson.title}</h2><p>{nextLesson.summary}</p></div>
        <div className="continue-meta"><span>{nextLesson.duration} min</span><button onClick={() => openLesson(nextLesson.id)} aria-label={`Open ${nextLesson.title}`}>→</button></div>
      </section>

      <div className="section-heading"><div><span>THE PATH</span><h2>Your repo-readiness map</h2></div><p>Complete in order, or jump straight to what today’s work needs.</p></div>

      <div className="module-grid">
        {modules.map((module) => {
          const moduleLessons = lessons.filter((lesson) => lesson.module === module.id);
          const done = moduleLessons.filter((lesson) => completed.includes(lesson.id)).length;
          const allDone = done === moduleLessons.length;
          return (
            <article className={`module-card accent-${module.accent}`} id={`module-${module.id}`} key={module.id}>
              <div className="module-top">
                <span className="module-number">{module.index}</span>
                <button className={`module-check ${allDone ? "done" : ""}`} onClick={() => completeModule(module.id)} aria-label={`${allDone ? "Mark incomplete" : "Complete"} ${module.title}`}>{allDone ? "✓" : ""}</button>
              </div>
              <h3>{module.title}</h3><p>{module.subtitle}</p>
              <div className="lesson-list">
                {moduleLessons.map((lesson) => (
                  <button key={lesson.id} onClick={() => openLesson(lesson.id)}>
                    <i className={completed.includes(lesson.id) ? "done" : ""}>{completed.includes(lesson.id) ? "✓" : ""}</i>
                    <span>{lesson.title}</span><small>{lesson.duration}m</small>
                  </button>
                ))}
              </div>
              <div className="module-footer"><div><i style={{ width: `${(done / moduleLessons.length) * 100}%` }} /></div><span>{done}/{moduleLessons.length}</span></div>
            </article>
          );
        })}
      </div>

      <section className="state-guide">
        <div><span className="kicker"><i /> ONE DECISION YOU’LL MAKE DAILY</span><h2>Where should this value live?</h2><p>Use the ownership model before reaching for a hook or library.</p></div>
        <div className="state-options">
          <span><b>Local state</b><small>Temporary UI owned here</small></span>
          <span><b>URL state</b><small>Shareable, navigable view</small></span>
          <span><b>Form state</b><small>User’s unsaved draft</small></span>
          <span><b>Query cache</b><small>Remote server truth</small></span>
          <span><b>Context</b><small>Shared subtree dependency</small></span>
        </div>
      </section>
    </div>
  );
}

function LessonView({ lesson, completed, answer, confidence, draft, onAnswer, onConfidence, onDraft, onComplete, onBack, onNext }: {
  lesson: Lesson;
  completed: boolean;
  answer?: number;
  confidence?: Confidence;
  draft?: string;
  onAnswer: (answer: number) => void;
  onConfidence: (value: Confidence) => void;
  onDraft: (value: string) => void;
  onComplete: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const courseModule = modules.find((item) => item.id === lesson.module)!;
  const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
  const isCorrect = answer === lesson.quiz.answer;
  const [copied, setCopied] = useState(false);
  const resources = resourcesFor(lesson);
  const workingCode = draft ?? lesson.react;

  async function copyWorkingCode() {
    await navigator.clipboard.writeText(workingCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="lesson-page">
      <header className="lesson-topbar">
        <button onClick={onBack}>← Course map</button>
        <div><span>{courseModule.index} · {courseModule.title}</span><i>{lessonIndex + 1} of {lessons.length}</i></div>
        <button className={completed ? "completed" : ""} onClick={onComplete}>{completed ? "✓ Completed" : "Mark as done"}</button>
      </header>

      <article className="lesson-article">
        <div className="lesson-title">
          <div><span>{lesson.eyebrow}</span><h1>{lesson.title}</h1><p>{lesson.summary}</p></div>
          <div className="lesson-stats"><span>{lesson.duration}<small>minutes</small></span><span>{lesson.difficulty}<small>difficulty</small></span></div>
        </div>

        <section className="why-box"><span>WHY THIS MATTERS</span><p>{lesson.why}</p></section>

        <section className="lesson-section"><span className="section-number">01</span><div><h2>What you’ll be able to do</h2><ul className="outcomes">{lesson.outcomes.map((outcome) => <li key={outcome}><i>✓</i>{outcome}</li>)}</ul></div></section>
        <section className="lesson-section"><span className="section-number">02</span><div><h2>The mental model</h2><p className="large-copy">{lesson.concept}</p></div></section>
        <section className="lesson-section"><span className="section-number">03</span><div className="code-section"><h2>Cross the bridge</h2><p>Same intent. Different runtime and responsibilities.</p><div className="code-grid"><CodePanel label="RUBY INSTINCT" language="rb" code={lesson.ruby} /><CodePanel label="REACT + TYPESCRIPT" language="tsx" code={lesson.react} /></div></div></section>
        <aside className="watch-box"><span>!</span><div><strong>Watch for this</strong><p>{lesson.watch}</p></div></aside>

        <section className="workbench">
          <div className="workbench-heading"><div><span>04 · DO IT NOW</span><h2>Build the proof, not just the memory.</h2><p>{labBrief(lesson)}</p></div><b>{lesson.duration < 25 ? "10–15" : "15–25"}<small>min lab</small></b></div>
          <div className="lab-grid">
            <div className="lab-brief">
              <strong>Definition of done</strong>
              <ol>
                {lesson.outcomes.map((outcome) => <li key={outcome}><span>□</span>{outcome}</li>)}
              </ol>
              <p><b>Rule:</b> close the finished example above and recreate the idea from memory. Being stuck is the useful part.</p>
            </div>
            <div className="editor-shell">
              <div><span>YOUR SCRATCHPAD</span><div><button onClick={() => onDraft(lesson.react)}>Reset</button><button onClick={copyWorkingCode}>{copied ? "Copied" : "Copy"}</button></div></div>
              <textarea value={workingCode} onChange={(event) => onDraft(event.target.value)} spellCheck={false} aria-label={`Code scratchpad for ${lesson.title}`} />
            </div>
          </div>
          <a className="launch-lab" href={practiceLinks[lesson.module].url} target="_blank" rel="noreferrer">Launch a browser workbench <span>↗</span></a>
        </section>

        <section className="resources-section">
          <div className="resources-heading"><span>05 · GO TO THE SOURCE</span><h2>Read less. Use it better.</h2><p>One authoritative reference, one watch option and one place to practise.</p></div>
          <div className="resource-grid">
            {resources.map((resource) => <a href={resource.url} target="_blank" rel="noreferrer" key={`${resource.kind}-${resource.title}`}>
              <div><span>{resource.kind === "Read" ? "▤" : resource.kind === "Watch" ? "▶" : "⌨"}</span><small>{resource.kind}</small></div>
              <strong>{resource.title}</strong><p>{resource.note}</p><b>Open resource ↗</b>
            </a>)}
          </div>
        </section>

        <section className="quiz-card">
          <div className="quiz-label"><span>CHECK YOUR MODEL</span><small>One question · instant feedback</small></div>
          <h2>{lesson.quiz.question}</h2>
          <div className="quiz-options">
            {lesson.quiz.options.map((option, index) => {
              const chosen = answer === index;
              const revealedCorrect = answer !== undefined && index === lesson.quiz.answer;
              return <button className={`${chosen ? "chosen" : ""} ${revealedCorrect ? "correct" : ""} ${chosen && !isCorrect ? "wrong" : ""}`} key={option} onClick={() => onAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}<i>{revealedCorrect ? "✓" : chosen && !isCorrect ? "×" : ""}</i></button>;
            })}
          </div>
          {answer !== undefined && <div className={`quiz-feedback ${isCorrect ? "right" : "try"}`}><strong>{isCorrect ? "Exactly right." : "Not quite—adjust the model."}</strong><p>{lesson.quiz.explanation}</p></div>}
        </section>

        <section className="confidence-card">
          <div><span>ADAPT THE COURSE</span><h2>How did that land?</h2><p>Your answer changes what we recommend next.</p></div>
          <div className="confidence-buttons">
            <button className={confidence === "lost" ? "active" : ""} onClick={() => onConfidence("lost")}><span>◔</span><b>I’m lost</b><small>Reinforce first</small></button>
            <button className={confidence === "steady" ? "active" : ""} onClick={() => onConfidence("steady")}><span>◑</span><b>About right</b><small>Keep this pace</small></button>
            <button className={confidence === "solid" ? "active" : ""} onClick={() => onConfidence("solid")}><span>●</span><b>Too easy</b><small>Skip basics</small></button>
          </div>
          {confidence && <div className="adaptive-note">{confidence === "lost" ? "We’ll keep the Ruby comparison visible and recommend another foundation exercise before advancing." : confidence === "solid" ? "We’ll favour the shorter path and surface advanced repo-specific details sooner." : "Good calibration. We’ll keep the current balance of explanation and practice."}</div>}
        </section>

        <footer className="lesson-footer">
          <button className="secondary-action" onClick={onComplete}>{completed ? "Mark incomplete" : "✓ Mark lesson complete"}</button>
          <button className="primary-action" onClick={onNext}>Next lesson <span>→</span></button>
        </footer>
      </article>
    </div>
  );
}

function CodePanel({ label, language, code }: { label: string; language: string; code: string }) {
  return <div className={`code-panel code-${language}`}><div><span>{label}</span><small>{language}</small></div><pre><code>{code}</code></pre></div>;
}

function ReferenceView({ query, setQuery, category, setCategory, results, referenceId, setReferenceId, openLesson, completed, searchRef }: {
  query: string;
  setQuery: (query: string) => void;
  category: ModuleId | "all";
  setCategory: (category: ModuleId | "all") => void;
  results: Lesson[];
  referenceId: string | null;
  setReferenceId: (id: string | null) => void;
  openLesson: (id: string) => void;
  completed: string[];
  searchRef: React.RefObject<HTMLInputElement | null>;
}) {
  const active = lessons.find((lesson) => lesson.id === referenceId);
  return (
    <div className="reference-page">
      <header className="reference-hero">
        <div><span className="kicker"><i /> FIELD GUIDE</span><h1>Your React<br /><em>reference desk.</em></h1><p>Fast answers, grounded in the architecture you’ll actually work with.</p></div>
        <div className="reference-stat"><strong>{lessons.length}</strong><span>concept cards</span><small>Course-linked · Ruby-aware</small></div>
      </header>
      <div className="search-wrap"><span>⌕</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hooks, forms, query keys, URL state…" aria-label="Search reference" /><kbd>/</kbd></div>
      <div className="filter-row" aria-label="Reference categories">
        <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>All topics</button>
        {modules.map((module) => <button className={category === module.id ? "active" : ""} key={module.id} onClick={() => setCategory(module.id)}>{module.title}</button>)}
      </div>
      <div className="reference-meta"><span>{results.length} {results.length === 1 ? "result" : "results"}</span><small>Select any card for the practical explanation</small></div>
      {results.length ? <div className="reference-grid">
        {results.map((lesson) => {
          const courseModule = modules.find((item) => item.id === lesson.module)!;
          return <button className={`reference-card accent-${courseModule.accent}`} key={lesson.id} onClick={() => setReferenceId(lesson.id)}>
            <div><span>{courseModule.index}</span>{completed.includes(lesson.id) && <i>✓ learned</i>}</div>
            <h2>{lesson.title}</h2><p>{lesson.summary}</p>
            <footer><span>{lesson.tags.slice(0, 2).join(" · ")}</span><b>→</b></footer>
          </button>;
        })}
      </div> : <div className="empty-reference"><span>⌕</span><h2>No match yet</h2><p>Try a broader term like “state”, “form”, “query” or “effect”.</p></div>}

      {active && <div className="reference-overlay" role="dialog" aria-modal="true" aria-labelledby="reference-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setReferenceId(null); }}>
        <aside className="reference-drawer">
          <button className="drawer-close" onClick={() => setReferenceId(null)} aria-label="Close reference">×</button>
          <span className="kicker"><i /> QUICK REFERENCE</span><h2 id="reference-title">{active.title}</h2><p className="drawer-summary">{active.summary}</p>
          <div className="drawer-rule"><strong>The model</strong><p>{active.concept}</p></div>
          <CodePanel label="REACT + TYPESCRIPT" language="tsx" code={active.react} />
          <div className="drawer-watch"><strong>Watch out</strong><p>{active.watch}</p></div>
          <div className="drawer-resources"><strong>Keep learning</strong>{resourcesFor(active).map((resource) => <a href={resource.url} target="_blank" rel="noreferrer" key={`${resource.kind}-${resource.title}`}><span>{resource.kind}</span>{resource.title}<b>↗</b></a>)}</div>
          <div className="drawer-tags">{active.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <button className="primary-action" onClick={() => openLesson(active.id)}>Open full lesson <span>→</span></button>
        </aside>
      </div>}
    </div>
  );
}
