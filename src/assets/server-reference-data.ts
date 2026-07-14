export type ServerReferenceParameter = {
  name: string
  type: string
  optional: boolean
  description: string
}

export type ServerReferenceItem = {
  name: string
  kind: "Function" | "Interface" | "Type"
  signature: string
  summary: string
  parameters: ServerReferenceParameter[]
  returns: string
  exampleTitle: string
  example: string
  sourceUrl: string
}

export type ServerReferenceGroup = {
  category: string
  items: ServerReferenceItem[]
}

export const SERVER_REFERENCE_GROUPS = [
  {
    category: "Middleware",
    items: [
      {
        name: "createSupabaseContext",
        kind: "Function",
        signature:
          "createSupabaseContext<Database>(request: Request, options?: WithSupabaseConfig): Promise<{ data: SupabaseContext<Database>; error: null } | { data: null; error: AuthError }>",
        summary:
          "Creates a SupabaseContext directly from a request. Use this when you need the context without the full withSupabase wrapper — e.g., inside framework route handlers or custom middleware. Returns a result tuple instead of producing a Response.",
        parameters: [
          {
            name: "request",
            type: "Request",
            optional: false,
            description: "The incoming HTTP request.",
          },
          {
            name: "options",
            type: "WithSupabaseConfig",
            optional: true,
            description: "Auth modes, environment overrides. The cors option is ignored here.",
          },
        ],
        returns:
          "{ data: SupabaseContext, error: null } on success, { data: null, error: AuthError } on failure.",
        exampleTitle: "User auth",
        example:
          "const { data: ctx, error } = await createSupabaseContext(request, { auth: 'user' })\nif (error) {\n  return Response.json({ message: error.message }, { status: error.status })\n}\nconst { data } = await ctx.supabase.rpc('get_my_items')",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/create-supabase-context.ts#L34",
      },
      {
        name: "withSupabase",
        kind: "Function",
        signature:
          "withSupabase<Database>(config: WithSupabaseConfig, handler: (req: Request, ctx: SupabaseContext<Database>) => Promise<Response>): (req: Request) => Promise<Response>",
        summary:
          "Wraps a request handler with Supabase auth, client creation, and CORS handling. Built for the Web API Request/Response standard that all modern runtimes implement natively. Handles CORS preflight, credential verification, context creation, and error responses. Your handler only runs on successful auth.",
        parameters: [
          {
            name: "config",
            type: "WithSupabaseConfig",
            optional: false,
            description: "Auth modes, CORS, and environment overrides. See WithSupabaseConfig.",
          },
          {
            name: "handler",
            type: "(req: Request, ctx: SupabaseContext<Database>) => Promise<Response>",
            optional: false,
            description: "Receives the Request and a fully-initialized SupabaseContext.",
          },
        ],
        returns: "A `(req: Request) => Promise<Response>` fetch handler.",
        exampleTitle: "Basic usage",
        example:
          "import { withSupabase } from '@supabase/server'\n\nexport default {\n  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {\n    const { data } = await ctx.supabase.rpc('get_my_profile')\n    return Response.json(data)\n  }),\n}",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/with-supabase.ts#L30",
      },
    ],
  },
  {
    category: "Adapters",
    items: [
      {
        name: "SupabaseError",
        kind: "Interface",
        signature: "SupabaseError: unknown",
        summary:
          "Wraps an AuthError as an Elysia-compatible error. Discriminate in onError via code === 'SupabaseError'. The original AuthError is available as the typed .cause.",
        parameters: [
          {
            name: "status",
            type: "number",
            optional: false,
            description: "",
          },
          {
            name: "cause",
            type: "AuthError",
            optional: false,
            description: "",
          },
          {
            name: "constructor",
            type: "unknown",
            optional: false,
            description: "",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/adapters/elysia/plugin.ts#L15",
      },
      {
        name: "withSupabase",
        kind: "Function",
        signature:
          'withSupabase(config?: Omit<WithSupabaseConfig, "cors">): Elysia<"", { decorator: object; store: object; derive: object; resolve: object }, { typebox: object; error: { SupabaseError: SupabaseError } }, { schema: object; standaloneSchema: object; macro: object; macroFn: object; parser: object }, object, { derive: object; resolve: { supabaseContext: SupabaseContext }; schema: object; standaloneSchema: object; response: ExtractErrorFromHandle<{ supabaseContext: SupabaseContext }> }, { derive: object; resolve: object; schema: object; standaloneSchema: object; response: object }>',
        summary:
          "Elysia plugin that creates a SupabaseContext and makes it available in route handlers. Skips if a previous plugin already set the context, enabling route-level overrides. Throws a SupabaseError on auth failure. .status is on the error directly; the original AuthError is available as the typed .cause. Discriminate in onError via code === 'SupabaseError'.",
        parameters: [
          {
            name: "config",
            type: 'Omit<WithSupabaseConfig, "cors">',
            optional: true,
            description:
              "Auth modes and optional environment overrides. CORS is excluded — use Elysia's CORS utilities.",
          },
        ],
        returns: "An Elysia plugin that exposes supabaseContext.",
        exampleTitle: "App-wide auth via .use()",
        example:
          "import { Elysia } from 'elysia'\nimport { withSupabase } from '@supabase/server/adapters/elysia'\n\nconst app = new Elysia()\n  .use(withSupabase({ auth: 'user' }))\n  .get('/games', async ({ supabaseContext }) => {\n    const { data } = await supabaseContext.supabase.from('favorite_games').select()\n    return data\n  })\n\napp.listen(3000)",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/adapters/elysia/plugin.ts#L73",
      },
    ],
  },
  {
    category: "Primitives",
    items: [
      {
        name: "createAdminClient",
        kind: "Function",
        signature:
          "createAdminClient<Database>(options?: CreateAdminClientOptions): SupabaseClient<Database>",
        summary:
          "Creates an admin Supabase client that bypasses Row-Level Security. Uses a secret key for authentication, giving full access to all data. Stateless — one client per request.",
        parameters: [
          {
            name: "options",
            type: "CreateAdminClientOptions",
            optional: true,
            description: "",
          },
        ],
        returns: "",
        exampleTitle: "Basic usage",
        example:
          "const supabaseAdmin = createAdminClient()\nconst { data } = await supabaseAdmin.from('audit_log').insert({ action: 'user_login' })",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/core/create-admin-client.ts#L27",
      },
      {
        name: "createContextClient",
        kind: "Function",
        signature:
          "createContextClient<Database>(options?: CreateContextClientOptions): SupabaseClient<Database>",
        summary:
          "Creates a Supabase client scoped to the caller's context. Configured with a publishable key and (optionally) the caller's JWT, so Row-Level Security policies apply. Stateless — one client per request.",
        parameters: [
          {
            name: "options",
            type: "CreateContextClientOptions",
            optional: true,
            description: "",
          },
        ],
        returns: "",
        exampleTitle: "With verified auth",
        example:
          "const { data: auth } = await verifyAuth(request, { auth: 'user' })\nconst supabase = createContextClient({\n  auth: { token: auth.token, keyName: auth.keyName },\n})\nconst { data } = await supabase.rpc('get_my_items')",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/core/create-context-client.ts#L30",
      },
      {
        name: "extractCredentials",
        kind: "Function",
        signature: "extractCredentials(request: Request): Credentials",
        summary:
          "Extracts authentication credentials from an incoming HTTP request. Reads two headers:\n\n- `Authorization: Bearer <token>` → extracted as `token`\n- `apikey: <key>` → extracted as `apikey`\n\nThis is a pure extraction step — no validation or verification is performed. Pass the result to `verifyCredentials` to validate against allowed auth modes.",
        parameters: [
          {
            name: "request",
            type: "Request",
            optional: false,
            description: "The incoming HTTP request.",
          },
        ],
        returns:
          "The extracted Credentials. Fields are null when the corresponding header is absent.",
        exampleTitle: "Basic usage",
        example:
          'import { extractCredentials } from \'@supabase/server/core\'\n\nconst creds = extractCredentials(request)\nconsole.log(creds.token)  // "eyJhbGci..." or null\nconsole.log(creds.apikey) // "sb-abc123-publishable-..." or null',
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/core/extract-credentials.ts#L27",
      },
      {
        name: "resolveEnv",
        kind: "Function",
        signature:
          "resolveEnv(overrides?: Partial<SupabaseEnv>): { data: SupabaseEnv; error: null } | { data: null; error: EnvError }",
        summary:
          "Resolves Supabase environment configuration from runtime environment variables. Reads SUPABASE_URL, keys (SUPABASE_PUBLISHABLE_KEYS / SUPABASE_SECRET_KEYS), and the JWKS source (SUPABASE_JWKS for inline keys, or SUPABASE_JWKS_URL for a remote endpoint). Works across Deno, Node.js, and Bun. For Cloudflare Workers, use overrides or enable node-compat.",
        parameters: [
          {
            name: "overrides",
            type: "Partial<SupabaseEnv>",
            optional: true,
            description: "Partial values that take precedence over env vars.",
          },
        ],
        returns:
          "{ data: SupabaseEnv, error: null } on success, { data: null, error: EnvError } on failure.",
        exampleTitle: "Reading and overriding env vars",
        example:
          "const { data: env, error } = resolveEnv()\nif (error) throw error\n\n// Override for tests\nconst { data: env } = resolveEnv({ url: 'http://localhost:54321' })",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/core/resolve-env.ts#L163",
      },
      {
        name: "verifyAuth",
        kind: "Function",
        signature:
          "verifyAuth(request: Request, options: VerifyAuthOptions): Promise<{ data: AuthResult; error: null } | { data: null; error: AuthError }>",
        summary:
          "Extracts credentials from a request and verifies them in a single step. This is a convenience function that combines extractCredentials and verifyCredentials. Use it when you want the full auth flow without needing to inspect the raw credentials.",
        parameters: [
          {
            name: "request",
            type: "Request",
            optional: false,
            description: "The incoming HTTP request.",
          },
          {
            name: "options",
            type: "VerifyAuthOptions",
            optional: false,
            description: "Auth modes to accept and optional environment overrides.",
          },
        ],
        returns:
          "A result tuple: `{ data, error }`.\n\n- On success: `{ data: AuthResult, error: null }`\n- On failure: `{ data: null, error: AuthError }`",
        exampleTitle: "User auth",
        example:
          "import { verifyAuth } from '@supabase/server/core'\n\nconst { data: auth, error } = await verifyAuth(request, {\n  auth: 'user',\n})\n\nif (error) {\n  return Response.json({ message: error.message }, { status: error.status })\n}\n\nconsole.log(auth.userClaims!.id) // \"d0f1a2b3-...\"",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/core/verify-auth.ts#L62",
      },
      {
        name: "VerifyAuthOptions",
        kind: "Interface",
        signature: "VerifyAuthOptions: unknown",
        summary: "Options for verifyAuth.",
        parameters: [
          {
            name: "auth",
            type: "AuthModeWithKey | AuthModeWithKey[]",
            optional: true,
            description:
              "Auth mode(s) to try. Modes are attempted in order — the first match wins.",
          },
          {
            name: "allow",
            type: "AuthModeWithKey | AuthModeWithKey[]",
            optional: true,
            description: "",
          },
          {
            name: "env",
            type: "Partial<SupabaseEnv>",
            optional: true,
            description: "Optional environment overrides (passed through to resolveEnv).",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/core/verify-auth.ts#L10",
      },
      {
        name: "verifyCredentials",
        kind: "Function",
        signature:
          "verifyCredentials(credentials: Credentials, options: VerifyCredentialsOptions): Promise<{ data: AuthResult; error: null } | { data: null; error: AuthError }>",
        summary:
          "Verifies pre-extracted credentials against one or more allowed auth modes. Tries each mode in order — first match wins. A mode is only tried when its credential is present; a JWT that is present but fails verification short-circuits the chain with InvalidCredentialsError instead of falling through to the next mode. Use verifyAuth to extract and verify in a single call.",
        parameters: [
          {
            name: "credentials",
            type: "Credentials",
            optional: false,
            description: "The credentials to verify (from extractCredentials).",
          },
          {
            name: "options",
            type: "VerifyCredentialsOptions",
            optional: false,
            description: "Allowed auth modes and optional env overrides.",
          },
        ],
        returns:
          "{ data: AuthResult, error: null } on success, { data: null, error: AuthError } on failure.",
        exampleTitle: "Multiple auth modes",
        example:
          "const credentials = extractCredentials(request)\nconst { data: auth, error } = await verifyCredentials(credentials, {\n  auth: ['user', 'publishable'],\n})\nif (error) {\n  return Response.json({ message: error.message }, { status: error.status })\n}",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/core/verify-credentials.ts#L311",
      },
      {
        name: "VerifyCredentialsOptions",
        kind: "Interface",
        signature: "VerifyCredentialsOptions: unknown",
        summary: "Options for verifyCredentials.",
        parameters: [
          {
            name: "auth",
            type: "AuthModeWithKey | AuthModeWithKey[]",
            optional: true,
            description:
              "Auth mode(s) to try. Modes are attempted in order — the first match wins.",
          },
          {
            name: "allow",
            type: "AuthModeWithKey | AuthModeWithKey[]",
            optional: true,
            description: "",
          },
          {
            name: "env",
            type: "Partial<SupabaseEnv>",
            optional: true,
            description: "Optional environment overrides (passed through to resolveEnv).",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/core/verify-credentials.ts#L30",
      },
    ],
  },
  {
    category: "Errors",
    items: [
      {
        name: "AuthError",
        kind: "Interface",
        signature: "AuthError: unknown",
        summary:
          "Thrown when authentication or authorization fails. Carries an HTTP status code suitable for returning directly in a response (typically 401 for invalid credentials, 500 for server-side auth failures).",
        parameters: [
          {
            name: "status",
            type: "number",
            optional: false,
            description:
              "HTTP status code.\n\n- `401` — Invalid or missing credentials\n- `500` — Server-side auth failure (e.g., missing JWKS, env misconfiguration)",
          },
          {
            name: "code",
            type: "string",
            optional: false,
            description: "Machine-readable error code.",
          },
          {
            name: "constructor",
            type: "unknown",
            optional: false,
            description: "",
          },
        ],
        returns: "",
        exampleTitle: "Catching an AuthError",
        example:
          "import { AuthError, createSupabaseContext } from '@supabase/server'\n\nconst { data: ctx, error } = await createSupabaseContext(request, { auth: 'user' })\nif (error) {\n  // error is an AuthError\n  return Response.json(\n    { message: error.message, code: error.code },\n    { status: error.status },\n  )\n}",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L130",
      },
      {
        name: "AuthGenericError",
        kind: "Type",
        signature: 'AuthGenericError: "AUTH_ERROR"',
        summary: "Generic authentication error code.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L159",
      },
      {
        name: "CreateSupabaseClientError",
        kind: "Type",
        signature: 'CreateSupabaseClientError: "CREATE_SUPABASE_CLIENT_ERROR"',
        summary: "Failed to create a Supabase client after auth succeeded.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L171",
      },
      {
        name: "EnvError",
        kind: "Interface",
        signature: "EnvError: unknown",
        summary:
          "Thrown when a required environment variable is missing or malformed. Always has status: 500 — environment errors are server-side configuration issues.",
        parameters: [
          {
            name: "status",
            type: "500",
            optional: false,
            description: "Always 500 — environment errors are server-side issues.",
          },
          {
            name: "code",
            type: "string",
            optional: false,
            description: "Machine-readable error code.",
          },
          {
            name: "constructor",
            type: "unknown",
            optional: false,
            description: "",
          },
        ],
        returns: "",
        exampleTitle: "Catching an EnvError",
        example:
          "import { EnvError } from '@supabase/server'\n\ntry {\n  const client = createAdminClient()\n} catch (e) {\n  if (e instanceof EnvError) {\n    console.error(`Config issue [${e.code}]: ${e.message}`)\n    // → \"Config issue [MISSING_SUPABASE_URL]: SUPABASE_URL is required but not set\"\n  }\n}",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L22",
      },
      {
        name: "EnvGenericError",
        kind: "Type",
        signature: 'EnvGenericError: "ENV_ERROR"',
        summary: "Generic environment error code.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L46",
      },
      {
        name: "Errors",
        kind: "Type",
        signature:
          "Errors: { MISSING_SUPABASE_URL: () => EnvError; MISSING_SECRET_KEY: (name: string) => EnvError; MISSING_DEFAULT_SECRET_KEY: () => EnvError; MISSING_PUBLISHABLE_KEY: (name: string) => EnvError; MISSING_DEFAULT_PUBLISHABLE_KEY: () => EnvError }",
        summary:
          "Factory map for all error types. Keyed by error code constant, each entry returns a pre-configured EnvError or AuthError.",
        parameters: [],
        returns: "",
        exampleTitle: "Throwing typed errors",
        example:
          "throw Errors[MissingSupabaseURLError]()\nthrow Errors[MissingPublishableKeyError]('mobile')",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L196",
      },
      {
        name: "InvalidCredentialsError",
        kind: "Type",
        signature: 'InvalidCredentialsError: "INVALID_CREDENTIALS"',
        summary: "No credential matched any allowed auth mode.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L165",
      },
      {
        name: "MissingDefaultPublishableKeyError",
        kind: "Type",
        signature: 'MissingDefaultPublishableKeyError: "MISSING_DEFAULT_PUBLISHABLE_KEY"',
        summary: "No default publishable key found.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L64",
      },
      {
        name: "MissingDefaultSecretKeyError",
        kind: "Type",
        signature: 'MissingDefaultSecretKeyError: "MISSING_DEFAULT_SECRET_KEY"',
        summary: "No default secret key found.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L77",
      },
      {
        name: "MissingPublishableKeyError",
        kind: "Type",
        signature: 'MissingPublishableKeyError: "MISSING_PUBLISHABLE_KEY"',
        summary: "Named publishable key not found in SUPABASE_PUBLISHABLE_KEYS.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L58",
      },
      {
        name: "MissingSecretKeyError",
        kind: "Type",
        signature: 'MissingSecretKeyError: "MISSING_SECRET_KEY"',
        summary: "Named secret key not found in SUPABASE_SECRET_KEYS.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L71",
      },
      {
        name: "MissingSupabaseURLError",
        kind: "Type",
        signature: 'MissingSupabaseURLError: "MISSING_SUPABASE_URL"',
        summary: "SUPABASE_URL is not set.",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/errors.ts#L52",
      },
    ],
  },
  {
    category: "Types",
    items: [
      {
        name: "Allow",
        kind: "Type",
        signature: "Allow: AuthMode",
        summary: "",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L38",
      },
      {
        name: "AllowWithKey",
        kind: "Type",
        signature: "AllowWithKey: AuthModeWithKey",
        summary: "",
        parameters: [],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L70",
      },
      {
        name: "AuthMode",
        kind: "Type",
        signature: 'AuthMode: "none" | "publishable" | "secret" | "user"',
        summary:
          'Authentication mode that determines what credentials a request must provide.\n\n- `"none"` — No credentials required. Every request is accepted.\n- `"publishable"` — Requires a valid publishable key in the `apikey` header.\n- `"secret"` — Requires a valid secret key in the `apikey` header (timing-safe comparison).\n- `"user"` — Requires a valid JWT in the `Authorization: Bearer <token>` header.',
        parameters: [],
        returns: "",
        exampleTitle: "Single mode",
        example:
          "// Single mode\nwithSupabase({ auth: 'user' }, handler)\n\n// Multiple modes — the first match wins.\n// A mode is tried only when its credential is present; a JWT that is\n// present but fails verification rejects immediately rather than falling\n// through to the next mode.\nwithSupabase({ auth: ['user', 'publishable'] }, handler)",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L32",
      },
      {
        name: "AuthModeWithKey",
        kind: "Type",
        signature: "AuthModeWithKey: AuthMode | unknown | unknown",
        summary:
          'Extended auth mode that supports targeting a specific named key. Use the colon syntax ("publishable:web_app") to require a specific named key from the SUPABASE_PUBLISHABLE_KEYS or SUPABASE_SECRET_KEYS JSON object. Use "publishable:*" or "secret:*" to accept any key in the set.',
        parameters: [],
        returns: "",
        exampleTitle: "Named key",
        example:
          "// Accept only the \"mobile\" publishable key\nwithSupabase({ auth: 'publishable:mobile' }, handler)\n\n// Accept any secret key\nwithSupabase({ auth: 'secret:*' }, handler)\n\n// Mix named keys with other modes\nwithSupabase({ auth: ['user', 'publishable:web_app'] }, handler)",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L61",
      },
      {
        name: "AuthResult",
        kind: "Interface",
        signature: "AuthResult: unknown",
        summary:
          'Result of credential verification. Contains the resolved auth mode, the verified token (for "user" mode), decoded JWT claims, and the matched key name (for "publishable" / "secret" modes).',
        parameters: [
          {
            name: "authMode",
            type: "AuthMode",
            optional: false,
            description: "The auth mode that was successfully matched.",
          },
          {
            name: "token",
            type: "string | null",
            optional: false,
            description: "The verified JWT, or null for non-user auth modes.",
          },
          {
            name: "userClaims",
            type: "UserClaims | null",
            optional: false,
            description:
              "Normalized user identity derived from the JWT, or null when no JWT is present.",
          },
          {
            name: "jwtClaims",
            type: "JWTClaims | null",
            optional: false,
            description: "Raw JWT payload, or null when no JWT is present.",
          },
          {
            name: "keyName",
            type: "string | null",
            optional: true,
            description:
              'Name of the matched key (e.g. "default", "mobile"), or null for "user" / "none" modes.',
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L143",
      },
      {
        name: "ClientAuth",
        kind: "Interface",
        signature: "ClientAuth: unknown",
        summary: "Auth identity for client creation functions.",
        parameters: [
          {
            name: "token",
            type: "string | null",
            optional: true,
            description: "The caller's JWT, or null for anonymous access.",
          },
          {
            name: "keyName",
            type: "string | null",
            optional: true,
            description:
              'Name of the API key to use. Falls back to "default", then first available.',
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L307",
      },
      {
        name: "CreateAdminClientOptions",
        kind: "Interface",
        signature: "CreateAdminClientOptions: unknown",
        summary: "Options for core.createAdminClient.",
        parameters: [
          {
            name: "auth",
            type: 'Pick<ClientAuth, "keyName">',
            optional: true,
            description: "Auth identity — key name from the verified request.",
          },
          {
            name: "env",
            type: "Partial<SupabaseEnv>",
            optional: true,
            description: "Override auto-detected environment variables.",
          },
          {
            name: "supabaseOptions",
            type: "SupabaseClientOptions<string>",
            optional: true,
            description:
              "Options forwarded to createClient(). accessToken is stripped; auth settings are force-overwritten.",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L334",
      },
      {
        name: "CreateContextClientOptions",
        kind: "Interface",
        signature: "CreateContextClientOptions: unknown",
        summary: "Options for core.createContextClient.",
        parameters: [
          {
            name: "auth",
            type: "ClientAuth",
            optional: true,
            description: "Auth identity — token and key name from the verified request.",
          },
          {
            name: "env",
            type: "Partial<SupabaseEnv>",
            optional: true,
            description: "Override auto-detected environment variables.",
          },
          {
            name: "supabaseOptions",
            type: "SupabaseClientOptions<string>",
            optional: true,
            description:
              "Options forwarded to createClient(). accessToken is stripped; auth settings are force-overwritten.",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L319",
      },
      {
        name: "Credentials",
        kind: "Interface",
        signature: "Credentials: unknown",
        summary:
          "Raw credentials extracted from an incoming HTTP request. Produced by core.extractCredentials from the Authorization and apikey headers.",
        parameters: [
          {
            name: "token",
            type: "string | null",
            optional: false,
            description:
              "Bearer token from the `Authorization: Bearer <token>` header, or null if absent.",
          },
          {
            name: "apikey",
            type: "string | null",
            optional: false,
            description: "API key from the apikey header, or null if absent.",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L125",
      },
      {
        name: "JWTClaims",
        kind: "Interface",
        signature: "JWTClaims: unknown",
        summary:
          "Standard JWT claims as defined by RFC 7519, extended with Supabase-specific fields. This is the raw JWT payload — use UserClaims for a normalized, camelCase view.",
        parameters: [
          {
            name: "sub",
            type: "string",
            optional: false,
            description: "Subject — the user's unique ID.",
          },
          {
            name: "iss",
            type: "string",
            optional: true,
            description: "Issuer — typically your Supabase project URL.",
          },
          {
            name: "aud",
            type: "string | string[]",
            optional: true,
            description: "Audience — who the token is intended for.",
          },
          {
            name: "exp",
            type: "number",
            optional: true,
            description: "Expiration time (seconds since epoch).",
          },
          {
            name: "iat",
            type: "number",
            optional: true,
            description: "Issued at (seconds since epoch).",
          },
          {
            name: "role",
            type: "string",
            optional: true,
            description: 'Supabase role (e.g. "authenticated", "anon").',
          },
          {
            name: "email",
            type: "string",
            optional: true,
            description: "User's email address from Supabase Auth.",
          },
          {
            name: "app_metadata",
            type: "Record<string, unknown>",
            optional: true,
            description: "Application-level metadata set via Supabase Auth admin APIs.",
          },
          {
            name: "user_metadata",
            type: "Record<string, unknown>",
            optional: true,
            description: "User-editable metadata set via Supabase Auth.",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L168",
      },
      {
        name: "SupabaseContext",
        kind: "Interface",
        signature: "SupabaseContext: unknown",
        summary:
          "The Supabase context created for each authenticated request. Contains pre-configured Supabase clients and the caller's identity. Identical regardless of which layer or adapter produced it.",
        parameters: [
          {
            name: "supabase",
            type: "SupabaseClient<Database>",
            optional: false,
            description: "Supabase client scoped to the caller's identity. RLS policies apply.",
          },
          {
            name: "supabaseAdmin",
            type: "SupabaseClient<Database>",
            optional: false,
            description: "Admin Supabase client that bypasses Row-Level Security.",
          },
          {
            name: "userClaims",
            type: "UserClaims | null",
            optional: false,
            description:
              "JWT-derived identity. For the full Supabase User object, call supabase.auth.getUser().",
          },
          {
            name: "jwtClaims",
            type: "JWTClaims | null",
            optional: false,
            description: "Raw JWT payload. null for non-user auth modes.",
          },
          {
            name: "authMode",
            type: "AuthMode",
            optional: false,
            description: "The auth mode that was used for this request.",
          },
          {
            name: "authKeyName",
            type: "string",
            optional: true,
            description:
              "The auth key name of the API key that was used for this request. Omitted for 'user' and 'none' modes, which don't match a named key.",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L352",
      },
      {
        name: "SupabaseEnv",
        kind: "Interface",
        signature: "SupabaseEnv: unknown",
        summary:
          "Resolved Supabase environment configuration. Holds the project URL, API keys, and JWKS needed by every other primitive. Typically resolved automatically from environment variables by core.resolveEnv, but can be passed explicitly via the env option.",
        parameters: [
          {
            name: "url",
            type: "string",
            optional: false,
            description:
              'Supabase project URL (e.g. `https://<ref>.supabase.co`). Sourced from `SUPABASE_URL`.',
          },
          {
            name: "publishableKeys",
            type: "Record<string, string>",
            optional: false,
            description:
              'Named publishable keys. Sourced from `SUPABASE_PUBLISHABLE_KEYS` (JSON object) or `SUPABASE_PUBLISHABLE_KEY` (single key, stored as `{ default: "<value>" }`).',
          },
          {
            name: "secretKeys",
            type: "Record<string, string>",
            optional: false,
            description:
              'Named secret keys. Sourced from `SUPABASE_SECRET_KEYS` (JSON object) or `SUPABASE_SECRET_KEY` (single key, stored as `{ default: "<value>" }`).',
          },
          {
            name: "jwks",
            type: "JSONWebKeySet | URL | null",
            optional: false,
            description:
              "JWKS source used for JWT verification. Sourced from one of (in priority order):\n\n- `SUPABASE_JWKS` — inline JSON. Resolves to a `JSONWebKeySet`.\n- `SUPABASE_JWKS_URL` — remote endpoint. Resolves to a URL; keys are fetched lazily and cached in memory (cooldown / max-age handled by jose). `https://` is always accepted; plain `http://` is accepted only for loopback hosts (`localhost`, `127.0.0.0/8`, `::1`) to support the Supabase CLI. Any other `http://` URL is rejected to prevent MITM swap-in of a forged signing key.\n\n`null` when no JWKS is configured (JWT verification will be unavailable). Each env var is authoritative when set: a malformed value resolves to `null` rather than falling through to the other variable.",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L82",
      },
      {
        name: "UserClaims",
        kind: "Interface",
        signature: "UserClaims: unknown",
        summary:
          "Normalized, camelCase view of the authenticated user's identity. Derived from JWTClaims. For the full Supabase User object (including email confirmation status, providers, etc.), call supabase.auth.getUser() using the context client.",
        parameters: [
          {
            name: "id",
            type: "string",
            optional: false,
            description: "User's unique ID (same as JWTClaims.sub).",
          },
          {
            name: "role",
            type: "string",
            optional: true,
            description: 'Supabase role (e.g. "authenticated").',
          },
          {
            name: "email",
            type: "string",
            optional: true,
            description: "User's email address.",
          },
          {
            name: "appMetadata",
            type: "Record<string, unknown>",
            optional: true,
            description: "Application-level metadata (e.g. roles, permissions).",
          },
          {
            name: "userMetadata",
            type: "Record<string, unknown>",
            optional: true,
            description: "User-editable profile metadata (e.g. display name, avatar).",
          },
        ],
        returns: "",
        exampleTitle: "Example",
        example: "",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L208",
      },
      {
        name: "WithSupabaseConfig",
        kind: "Interface",
        signature: "WithSupabaseConfig: unknown",
        summary:
          "Configuration for withSupabase and createSupabaseContext. Controls which auth modes are accepted, environment overrides, and CORS behavior.",
        parameters: [
          {
            name: "auth",
            type: "AuthModeWithKey | AuthModeWithKey[]",
            optional: true,
            description:
              "Auth mode(s) to accept. Modes are tried in order — the first match wins. A mode falls through only when its credential is absent; a present-but-invalid JWT short-circuits the chain with InvalidCredentialsError.",
          },
          {
            name: "allow",
            type: "AuthModeWithKey | AuthModeWithKey[]",
            optional: true,
            description: "",
          },
          {
            name: "env",
            type: "Partial<SupabaseEnv>",
            optional: true,
            description:
              "Override auto-detected environment variables. Useful for testing or when running in environments without standard env var support.",
          },
          {
            name: "cors",
            type: "boolean | Record<string, string>",
            optional: true,
            description:
              "CORS configuration for the `withSupabase` wrapper.\n\n- `true` (default) — uses @supabase/supabase-js default CORS headers.\n- `false` — disables CORS handling entirely.\n- `Record<string, string>` — custom CORS headers.",
          },
          {
            name: "supabaseOptions",
            type: "SupabaseClientOptions<string>",
            optional: true,
            description:
              "Options forwarded to both internal createClient() calls. accessToken is stripped, and auth settings (persistSession, autoRefreshToken, detectSessionInUrl) are force-overwritten to server-safe values.",
          },
        ],
        returns: "",
        exampleTitle: "Basic usage",
        example:
          "// Require authenticated users, auto-CORS enabled (default)\nconst config: WithSupabaseConfig = { auth: 'user' }\n\n// Accept users or service-to-service calls, custom CORS headers\nconst config: WithSupabaseConfig = {\n  auth: ['user', 'secret'],\n  cors: { 'Access-Control-Allow-Origin': 'https://myapp.com' },\n}\n\n// No auth required, CORS disabled\nconst config: WithSupabaseConfig = { auth: 'none', cors: false }",
        sourceUrl:
          "https://github.com/supabase/server/blob/09a67506dbb4853e1c38d57873d750e9c34d15aa/src/types.ts#L247",
      },
    ],
  },
] satisfies ServerReferenceGroup[]
