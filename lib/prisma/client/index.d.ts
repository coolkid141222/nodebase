
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model Workflow
 * 
 */
export type Workflow = $Result.DefaultSelection<Prisma.$WorkflowPayload>
/**
 * Model Node
 * 
 */
export type Node = $Result.DefaultSelection<Prisma.$NodePayload>
/**
 * Model Connection
 * 
 */
export type Connection = $Result.DefaultSelection<Prisma.$ConnectionPayload>
/**
 * Model Credential
 * 
 */
export type Credential = $Result.DefaultSelection<Prisma.$CredentialPayload>
/**
 * Model Execution
 * 
 */
export type Execution = $Result.DefaultSelection<Prisma.$ExecutionPayload>
/**
 * Model ExecutionStep
 * 
 */
export type ExecutionStep = $Result.DefaultSelection<Prisma.$ExecutionStepPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const NodeType: {
  INITIAL: 'INITIAL',
  TRIGGER: 'TRIGGER',
  ACTION: 'ACTION',
  CONDITION: 'CONDITION',
  HTTP_REQUEST: 'HTTP_REQUEST',
  MANUAL_TRIGGER: 'MANUAL_TRIGGER'
};

export type NodeType = (typeof NodeType)[keyof typeof NodeType]


export const CredentialProvider: {
  OPENAI: 'OPENAI',
  ANTHROPIC: 'ANTHROPIC',
  GOOGLE: 'GOOGLE',
  DISCORD: 'DISCORD',
  SLACK: 'SLACK',
  STRIPE: 'STRIPE',
  POLAR: 'POLAR'
};

export type CredentialProvider = (typeof CredentialProvider)[keyof typeof CredentialProvider]


export const ExecutionTriggerType: {
  MANUAL: 'MANUAL',
  WEBHOOK: 'WEBHOOK',
  GOOGLE_FORM: 'GOOGLE_FORM',
  STRIPE: 'STRIPE'
};

export type ExecutionTriggerType = (typeof ExecutionTriggerType)[keyof typeof ExecutionTriggerType]


export const ExecutionStatus: {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED'
};

export type ExecutionStatus = (typeof ExecutionStatus)[keyof typeof ExecutionStatus]


export const ExecutionStepStatus: {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED'
};

export type ExecutionStepStatus = (typeof ExecutionStepStatus)[keyof typeof ExecutionStepStatus]

}

export type NodeType = $Enums.NodeType

export const NodeType: typeof $Enums.NodeType

export type CredentialProvider = $Enums.CredentialProvider

export const CredentialProvider: typeof $Enums.CredentialProvider

export type ExecutionTriggerType = $Enums.ExecutionTriggerType

export const ExecutionTriggerType: typeof $Enums.ExecutionTriggerType

export type ExecutionStatus = $Enums.ExecutionStatus

export const ExecutionStatus: typeof $Enums.ExecutionStatus

export type ExecutionStepStatus = $Enums.ExecutionStepStatus

export const ExecutionStepStatus: typeof $Enums.ExecutionStepStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workflow`: Exposes CRUD operations for the **Workflow** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workflows
    * const workflows = await prisma.workflow.findMany()
    * ```
    */
  get workflow(): Prisma.WorkflowDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.node`: Exposes CRUD operations for the **Node** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Nodes
    * const nodes = await prisma.node.findMany()
    * ```
    */
  get node(): Prisma.NodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.connection`: Exposes CRUD operations for the **Connection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Connections
    * const connections = await prisma.connection.findMany()
    * ```
    */
  get connection(): Prisma.ConnectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.credential`: Exposes CRUD operations for the **Credential** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Credentials
    * const credentials = await prisma.credential.findMany()
    * ```
    */
  get credential(): Prisma.CredentialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.execution`: Exposes CRUD operations for the **Execution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Executions
    * const executions = await prisma.execution.findMany()
    * ```
    */
  get execution(): Prisma.ExecutionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.executionStep`: Exposes CRUD operations for the **ExecutionStep** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExecutionSteps
    * const executionSteps = await prisma.executionStep.findMany()
    * ```
    */
  get executionStep(): Prisma.ExecutionStepDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Account: 'Account',
    Verification: 'Verification',
    Workflow: 'Workflow',
    Node: 'Node',
    Connection: 'Connection',
    Credential: 'Credential',
    Execution: 'Execution',
    ExecutionStep: 'ExecutionStep'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "account" | "verification" | "workflow" | "node" | "connection" | "credential" | "execution" | "executionStep"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      Workflow: {
        payload: Prisma.$WorkflowPayload<ExtArgs>
        fields: Prisma.WorkflowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkflowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkflowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          findFirst: {
            args: Prisma.WorkflowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkflowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          findMany: {
            args: Prisma.WorkflowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>[]
          }
          create: {
            args: Prisma.WorkflowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          createMany: {
            args: Prisma.WorkflowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkflowCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>[]
          }
          delete: {
            args: Prisma.WorkflowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          update: {
            args: Prisma.WorkflowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          deleteMany: {
            args: Prisma.WorkflowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkflowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkflowUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>[]
          }
          upsert: {
            args: Prisma.WorkflowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          aggregate: {
            args: Prisma.WorkflowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflow>
          }
          groupBy: {
            args: Prisma.WorkflowGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkflowGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkflowCountArgs<ExtArgs>
            result: $Utils.Optional<WorkflowCountAggregateOutputType> | number
          }
        }
      }
      Node: {
        payload: Prisma.$NodePayload<ExtArgs>
        fields: Prisma.NodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          findFirst: {
            args: Prisma.NodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          findMany: {
            args: Prisma.NodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>[]
          }
          create: {
            args: Prisma.NodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          createMany: {
            args: Prisma.NodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>[]
          }
          delete: {
            args: Prisma.NodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          update: {
            args: Prisma.NodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          deleteMany: {
            args: Prisma.NodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>[]
          }
          upsert: {
            args: Prisma.NodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          aggregate: {
            args: Prisma.NodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNode>
          }
          groupBy: {
            args: Prisma.NodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<NodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.NodeCountArgs<ExtArgs>
            result: $Utils.Optional<NodeCountAggregateOutputType> | number
          }
        }
      }
      Connection: {
        payload: Prisma.$ConnectionPayload<ExtArgs>
        fields: Prisma.ConnectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConnectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConnectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          findFirst: {
            args: Prisma.ConnectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConnectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          findMany: {
            args: Prisma.ConnectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>[]
          }
          create: {
            args: Prisma.ConnectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          createMany: {
            args: Prisma.ConnectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConnectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>[]
          }
          delete: {
            args: Prisma.ConnectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          update: {
            args: Prisma.ConnectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          deleteMany: {
            args: Prisma.ConnectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConnectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConnectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>[]
          }
          upsert: {
            args: Prisma.ConnectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          aggregate: {
            args: Prisma.ConnectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConnection>
          }
          groupBy: {
            args: Prisma.ConnectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConnectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConnectionCountArgs<ExtArgs>
            result: $Utils.Optional<ConnectionCountAggregateOutputType> | number
          }
        }
      }
      Credential: {
        payload: Prisma.$CredentialPayload<ExtArgs>
        fields: Prisma.CredentialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CredentialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CredentialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>
          }
          findFirst: {
            args: Prisma.CredentialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CredentialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>
          }
          findMany: {
            args: Prisma.CredentialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>[]
          }
          create: {
            args: Prisma.CredentialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>
          }
          createMany: {
            args: Prisma.CredentialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CredentialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>[]
          }
          delete: {
            args: Prisma.CredentialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>
          }
          update: {
            args: Prisma.CredentialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>
          }
          deleteMany: {
            args: Prisma.CredentialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CredentialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CredentialUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>[]
          }
          upsert: {
            args: Prisma.CredentialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialPayload>
          }
          aggregate: {
            args: Prisma.CredentialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCredential>
          }
          groupBy: {
            args: Prisma.CredentialGroupByArgs<ExtArgs>
            result: $Utils.Optional<CredentialGroupByOutputType>[]
          }
          count: {
            args: Prisma.CredentialCountArgs<ExtArgs>
            result: $Utils.Optional<CredentialCountAggregateOutputType> | number
          }
        }
      }
      Execution: {
        payload: Prisma.$ExecutionPayload<ExtArgs>
        fields: Prisma.ExecutionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExecutionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExecutionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          findFirst: {
            args: Prisma.ExecutionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExecutionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          findMany: {
            args: Prisma.ExecutionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>[]
          }
          create: {
            args: Prisma.ExecutionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          createMany: {
            args: Prisma.ExecutionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExecutionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>[]
          }
          delete: {
            args: Prisma.ExecutionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          update: {
            args: Prisma.ExecutionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          deleteMany: {
            args: Prisma.ExecutionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExecutionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExecutionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>[]
          }
          upsert: {
            args: Prisma.ExecutionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          aggregate: {
            args: Prisma.ExecutionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExecution>
          }
          groupBy: {
            args: Prisma.ExecutionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExecutionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExecutionCountArgs<ExtArgs>
            result: $Utils.Optional<ExecutionCountAggregateOutputType> | number
          }
        }
      }
      ExecutionStep: {
        payload: Prisma.$ExecutionStepPayload<ExtArgs>
        fields: Prisma.ExecutionStepFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExecutionStepFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExecutionStepFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>
          }
          findFirst: {
            args: Prisma.ExecutionStepFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExecutionStepFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>
          }
          findMany: {
            args: Prisma.ExecutionStepFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>[]
          }
          create: {
            args: Prisma.ExecutionStepCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>
          }
          createMany: {
            args: Prisma.ExecutionStepCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExecutionStepCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>[]
          }
          delete: {
            args: Prisma.ExecutionStepDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>
          }
          update: {
            args: Prisma.ExecutionStepUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>
          }
          deleteMany: {
            args: Prisma.ExecutionStepDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExecutionStepUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExecutionStepUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>[]
          }
          upsert: {
            args: Prisma.ExecutionStepUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionStepPayload>
          }
          aggregate: {
            args: Prisma.ExecutionStepAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExecutionStep>
          }
          groupBy: {
            args: Prisma.ExecutionStepGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExecutionStepGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExecutionStepCountArgs<ExtArgs>
            result: $Utils.Optional<ExecutionStepCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    account?: AccountOmit
    verification?: VerificationOmit
    workflow?: WorkflowOmit
    node?: NodeOmit
    connection?: ConnectionOmit
    credential?: CredentialOmit
    execution?: ExecutionOmit
    executionStep?: ExecutionStepOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    accounts: number
    workflows: number
    credentials: number
    executions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    workflows?: boolean | UserCountOutputTypeCountWorkflowsArgs
    credentials?: boolean | UserCountOutputTypeCountCredentialsArgs
    executions?: boolean | UserCountOutputTypeCountExecutionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWorkflowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCredentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CredentialWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExecutionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionWhereInput
  }


  /**
   * Count Type WorkflowCountOutputType
   */

  export type WorkflowCountOutputType = {
    nodes: number
    connections: number
    executions: number
  }

  export type WorkflowCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nodes?: boolean | WorkflowCountOutputTypeCountNodesArgs
    connections?: boolean | WorkflowCountOutputTypeCountConnectionsArgs
    executions?: boolean | WorkflowCountOutputTypeCountExecutionsArgs
  }

  // Custom InputTypes
  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowCountOutputType
     */
    select?: WorkflowCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeCountNodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NodeWhereInput
  }

  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeCountConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConnectionWhereInput
  }

  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeCountExecutionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionWhereInput
  }


  /**
   * Count Type NodeCountOutputType
   */

  export type NodeCountOutputType = {
    fromConnections: number
    toConnections: number
    executionSteps: number
  }

  export type NodeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fromConnections?: boolean | NodeCountOutputTypeCountFromConnectionsArgs
    toConnections?: boolean | NodeCountOutputTypeCountToConnectionsArgs
    executionSteps?: boolean | NodeCountOutputTypeCountExecutionStepsArgs
  }

  // Custom InputTypes
  /**
   * NodeCountOutputType without action
   */
  export type NodeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NodeCountOutputType
     */
    select?: NodeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NodeCountOutputType without action
   */
  export type NodeCountOutputTypeCountFromConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConnectionWhereInput
  }

  /**
   * NodeCountOutputType without action
   */
  export type NodeCountOutputTypeCountToConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConnectionWhereInput
  }

  /**
   * NodeCountOutputType without action
   */
  export type NodeCountOutputTypeCountExecutionStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionStepWhereInput
  }


  /**
   * Count Type ExecutionCountOutputType
   */

  export type ExecutionCountOutputType = {
    steps: number
  }

  export type ExecutionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    steps?: boolean | ExecutionCountOutputTypeCountStepsArgs
  }

  // Custom InputTypes
  /**
   * ExecutionCountOutputType without action
   */
  export type ExecutionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionCountOutputType
     */
    select?: ExecutionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExecutionCountOutputType without action
   */
  export type ExecutionCountOutputTypeCountStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionStepWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    workflows?: boolean | User$workflowsArgs<ExtArgs>
    credentials?: boolean | User$credentialsArgs<ExtArgs>
    executions?: boolean | User$executionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    workflows?: boolean | User$workflowsArgs<ExtArgs>
    credentials?: boolean | User$credentialsArgs<ExtArgs>
    executions?: boolean | User$executionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      workflows: Prisma.$WorkflowPayload<ExtArgs>[]
      credentials: Prisma.$CredentialPayload<ExtArgs>[]
      executions: Prisma.$ExecutionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      emailVerified: boolean
      image: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    workflows<T extends User$workflowsArgs<ExtArgs> = {}>(args?: Subset<T, User$workflowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    credentials<T extends User$credentialsArgs<ExtArgs> = {}>(args?: Subset<T, User$credentialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    executions<T extends User$executionsArgs<ExtArgs> = {}>(args?: Subset<T, User$executionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.workflows
   */
  export type User$workflowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    where?: WorkflowWhereInput
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    cursor?: WorkflowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowScalarFieldEnum | WorkflowScalarFieldEnum[]
  }

  /**
   * User.credentials
   */
  export type User$credentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    where?: CredentialWhereInput
    orderBy?: CredentialOrderByWithRelationInput | CredentialOrderByWithRelationInput[]
    cursor?: CredentialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CredentialScalarFieldEnum | CredentialScalarFieldEnum[]
  }

  /**
   * User.executions
   */
  export type User$executionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    where?: ExecutionWhereInput
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    cursor?: ExecutionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    createdAt: number
    updatedAt: number
    ipAddress: number
    userAgent: number
    userId: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "createdAt" | "updatedAt" | "ipAddress" | "userAgent" | "userId", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model Workflow
   */

  export type AggregateWorkflow = {
    _count: WorkflowCountAggregateOutputType | null
    _min: WorkflowMinAggregateOutputType | null
    _max: WorkflowMaxAggregateOutputType | null
  }

  export type WorkflowMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type WorkflowMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type WorkflowCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type WorkflowMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type WorkflowMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type WorkflowCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type WorkflowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workflow to aggregate.
     */
    where?: WorkflowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workflows to fetch.
     */
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkflowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workflows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workflows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workflows
    **/
    _count?: true | WorkflowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkflowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkflowMaxAggregateInputType
  }

  export type GetWorkflowAggregateType<T extends WorkflowAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflow[P]>
      : GetScalarType<T[P], AggregateWorkflow[P]>
  }




  export type WorkflowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowWhereInput
    orderBy?: WorkflowOrderByWithAggregationInput | WorkflowOrderByWithAggregationInput[]
    by: WorkflowScalarFieldEnum[] | WorkflowScalarFieldEnum
    having?: WorkflowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkflowCountAggregateInputType | true
    _min?: WorkflowMinAggregateInputType
    _max?: WorkflowMaxAggregateInputType
  }

  export type WorkflowGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    userId: string
    _count: WorkflowCountAggregateOutputType | null
    _min: WorkflowMinAggregateOutputType | null
    _max: WorkflowMaxAggregateOutputType | null
  }

  type GetWorkflowGroupByPayload<T extends WorkflowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkflowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkflowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkflowGroupByOutputType[P]>
            : GetScalarType<T[P], WorkflowGroupByOutputType[P]>
        }
      >
    >


  export type WorkflowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    nodes?: boolean | Workflow$nodesArgs<ExtArgs>
    connections?: boolean | Workflow$connectionsArgs<ExtArgs>
    executions?: boolean | Workflow$executionsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | WorkflowCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflow"]>

  export type WorkflowSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflow"]>

  export type WorkflowSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflow"]>

  export type WorkflowSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type WorkflowOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["workflow"]>
  export type WorkflowInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nodes?: boolean | Workflow$nodesArgs<ExtArgs>
    connections?: boolean | Workflow$connectionsArgs<ExtArgs>
    executions?: boolean | Workflow$executionsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | WorkflowCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkflowIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WorkflowIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WorkflowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workflow"
    objects: {
      nodes: Prisma.$NodePayload<ExtArgs>[]
      connections: Prisma.$ConnectionPayload<ExtArgs>[]
      executions: Prisma.$ExecutionPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
      userId: string
    }, ExtArgs["result"]["workflow"]>
    composites: {}
  }

  type WorkflowGetPayload<S extends boolean | null | undefined | WorkflowDefaultArgs> = $Result.GetResult<Prisma.$WorkflowPayload, S>

  type WorkflowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkflowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkflowCountAggregateInputType | true
    }

  export interface WorkflowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workflow'], meta: { name: 'Workflow' } }
    /**
     * Find zero or one Workflow that matches the filter.
     * @param {WorkflowFindUniqueArgs} args - Arguments to find a Workflow
     * @example
     * // Get one Workflow
     * const workflow = await prisma.workflow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkflowFindUniqueArgs>(args: SelectSubset<T, WorkflowFindUniqueArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Workflow that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkflowFindUniqueOrThrowArgs} args - Arguments to find a Workflow
     * @example
     * // Get one Workflow
     * const workflow = await prisma.workflow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkflowFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkflowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workflow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFindFirstArgs} args - Arguments to find a Workflow
     * @example
     * // Get one Workflow
     * const workflow = await prisma.workflow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkflowFindFirstArgs>(args?: SelectSubset<T, WorkflowFindFirstArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workflow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFindFirstOrThrowArgs} args - Arguments to find a Workflow
     * @example
     * // Get one Workflow
     * const workflow = await prisma.workflow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkflowFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkflowFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Workflows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workflows
     * const workflows = await prisma.workflow.findMany()
     * 
     * // Get first 10 Workflows
     * const workflows = await prisma.workflow.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflowWithIdOnly = await prisma.workflow.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkflowFindManyArgs>(args?: SelectSubset<T, WorkflowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Workflow.
     * @param {WorkflowCreateArgs} args - Arguments to create a Workflow.
     * @example
     * // Create one Workflow
     * const Workflow = await prisma.workflow.create({
     *   data: {
     *     // ... data to create a Workflow
     *   }
     * })
     * 
     */
    create<T extends WorkflowCreateArgs>(args: SelectSubset<T, WorkflowCreateArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Workflows.
     * @param {WorkflowCreateManyArgs} args - Arguments to create many Workflows.
     * @example
     * // Create many Workflows
     * const workflow = await prisma.workflow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkflowCreateManyArgs>(args?: SelectSubset<T, WorkflowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workflows and returns the data saved in the database.
     * @param {WorkflowCreateManyAndReturnArgs} args - Arguments to create many Workflows.
     * @example
     * // Create many Workflows
     * const workflow = await prisma.workflow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workflows and only return the `id`
     * const workflowWithIdOnly = await prisma.workflow.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkflowCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkflowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Workflow.
     * @param {WorkflowDeleteArgs} args - Arguments to delete one Workflow.
     * @example
     * // Delete one Workflow
     * const Workflow = await prisma.workflow.delete({
     *   where: {
     *     // ... filter to delete one Workflow
     *   }
     * })
     * 
     */
    delete<T extends WorkflowDeleteArgs>(args: SelectSubset<T, WorkflowDeleteArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Workflow.
     * @param {WorkflowUpdateArgs} args - Arguments to update one Workflow.
     * @example
     * // Update one Workflow
     * const workflow = await prisma.workflow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkflowUpdateArgs>(args: SelectSubset<T, WorkflowUpdateArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Workflows.
     * @param {WorkflowDeleteManyArgs} args - Arguments to filter Workflows to delete.
     * @example
     * // Delete a few Workflows
     * const { count } = await prisma.workflow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkflowDeleteManyArgs>(args?: SelectSubset<T, WorkflowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workflows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workflows
     * const workflow = await prisma.workflow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkflowUpdateManyArgs>(args: SelectSubset<T, WorkflowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workflows and returns the data updated in the database.
     * @param {WorkflowUpdateManyAndReturnArgs} args - Arguments to update many Workflows.
     * @example
     * // Update many Workflows
     * const workflow = await prisma.workflow.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Workflows and only return the `id`
     * const workflowWithIdOnly = await prisma.workflow.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkflowUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkflowUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Workflow.
     * @param {WorkflowUpsertArgs} args - Arguments to update or create a Workflow.
     * @example
     * // Update or create a Workflow
     * const workflow = await prisma.workflow.upsert({
     *   create: {
     *     // ... data to create a Workflow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workflow we want to update
     *   }
     * })
     */
    upsert<T extends WorkflowUpsertArgs>(args: SelectSubset<T, WorkflowUpsertArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Workflows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowCountArgs} args - Arguments to filter Workflows to count.
     * @example
     * // Count the number of Workflows
     * const count = await prisma.workflow.count({
     *   where: {
     *     // ... the filter for the Workflows we want to count
     *   }
     * })
    **/
    count<T extends WorkflowCountArgs>(
      args?: Subset<T, WorkflowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkflowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workflow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkflowAggregateArgs>(args: Subset<T, WorkflowAggregateArgs>): Prisma.PrismaPromise<GetWorkflowAggregateType<T>>

    /**
     * Group by Workflow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkflowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkflowGroupByArgs['orderBy'] }
        : { orderBy?: WorkflowGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkflowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workflow model
   */
  readonly fields: WorkflowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workflow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkflowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    nodes<T extends Workflow$nodesArgs<ExtArgs> = {}>(args?: Subset<T, Workflow$nodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    connections<T extends Workflow$connectionsArgs<ExtArgs> = {}>(args?: Subset<T, Workflow$connectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    executions<T extends Workflow$executionsArgs<ExtArgs> = {}>(args?: Subset<T, Workflow$executionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Workflow model
   */
  interface WorkflowFieldRefs {
    readonly id: FieldRef<"Workflow", 'String'>
    readonly name: FieldRef<"Workflow", 'String'>
    readonly createdAt: FieldRef<"Workflow", 'DateTime'>
    readonly updatedAt: FieldRef<"Workflow", 'DateTime'>
    readonly userId: FieldRef<"Workflow", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Workflow findUnique
   */
  export type WorkflowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflow to fetch.
     */
    where: WorkflowWhereUniqueInput
  }

  /**
   * Workflow findUniqueOrThrow
   */
  export type WorkflowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflow to fetch.
     */
    where: WorkflowWhereUniqueInput
  }

  /**
   * Workflow findFirst
   */
  export type WorkflowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflow to fetch.
     */
    where?: WorkflowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workflows to fetch.
     */
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workflows.
     */
    cursor?: WorkflowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workflows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workflows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workflows.
     */
    distinct?: WorkflowScalarFieldEnum | WorkflowScalarFieldEnum[]
  }

  /**
   * Workflow findFirstOrThrow
   */
  export type WorkflowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflow to fetch.
     */
    where?: WorkflowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workflows to fetch.
     */
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workflows.
     */
    cursor?: WorkflowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workflows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workflows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workflows.
     */
    distinct?: WorkflowScalarFieldEnum | WorkflowScalarFieldEnum[]
  }

  /**
   * Workflow findMany
   */
  export type WorkflowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflows to fetch.
     */
    where?: WorkflowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workflows to fetch.
     */
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workflows.
     */
    cursor?: WorkflowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workflows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workflows.
     */
    skip?: number
    distinct?: WorkflowScalarFieldEnum | WorkflowScalarFieldEnum[]
  }

  /**
   * Workflow create
   */
  export type WorkflowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * The data needed to create a Workflow.
     */
    data: XOR<WorkflowCreateInput, WorkflowUncheckedCreateInput>
  }

  /**
   * Workflow createMany
   */
  export type WorkflowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workflows.
     */
    data: WorkflowCreateManyInput | WorkflowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workflow createManyAndReturn
   */
  export type WorkflowCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * The data used to create many Workflows.
     */
    data: WorkflowCreateManyInput | WorkflowCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workflow update
   */
  export type WorkflowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * The data needed to update a Workflow.
     */
    data: XOR<WorkflowUpdateInput, WorkflowUncheckedUpdateInput>
    /**
     * Choose, which Workflow to update.
     */
    where: WorkflowWhereUniqueInput
  }

  /**
   * Workflow updateMany
   */
  export type WorkflowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workflows.
     */
    data: XOR<WorkflowUpdateManyMutationInput, WorkflowUncheckedUpdateManyInput>
    /**
     * Filter which Workflows to update
     */
    where?: WorkflowWhereInput
    /**
     * Limit how many Workflows to update.
     */
    limit?: number
  }

  /**
   * Workflow updateManyAndReturn
   */
  export type WorkflowUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * The data used to update Workflows.
     */
    data: XOR<WorkflowUpdateManyMutationInput, WorkflowUncheckedUpdateManyInput>
    /**
     * Filter which Workflows to update
     */
    where?: WorkflowWhereInput
    /**
     * Limit how many Workflows to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workflow upsert
   */
  export type WorkflowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * The filter to search for the Workflow to update in case it exists.
     */
    where: WorkflowWhereUniqueInput
    /**
     * In case the Workflow found by the `where` argument doesn't exist, create a new Workflow with this data.
     */
    create: XOR<WorkflowCreateInput, WorkflowUncheckedCreateInput>
    /**
     * In case the Workflow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkflowUpdateInput, WorkflowUncheckedUpdateInput>
  }

  /**
   * Workflow delete
   */
  export type WorkflowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter which Workflow to delete.
     */
    where: WorkflowWhereUniqueInput
  }

  /**
   * Workflow deleteMany
   */
  export type WorkflowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workflows to delete
     */
    where?: WorkflowWhereInput
    /**
     * Limit how many Workflows to delete.
     */
    limit?: number
  }

  /**
   * Workflow.nodes
   */
  export type Workflow$nodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    where?: NodeWhereInput
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    cursor?: NodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NodeScalarFieldEnum | NodeScalarFieldEnum[]
  }

  /**
   * Workflow.connections
   */
  export type Workflow$connectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    where?: ConnectionWhereInput
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    cursor?: ConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Workflow.executions
   */
  export type Workflow$executionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    where?: ExecutionWhereInput
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    cursor?: ExecutionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * Workflow without action
   */
  export type WorkflowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workflow
     */
    omit?: WorkflowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
  }


  /**
   * Model Node
   */

  export type AggregateNode = {
    _count: NodeCountAggregateOutputType | null
    _min: NodeMinAggregateOutputType | null
    _max: NodeMaxAggregateOutputType | null
  }

  export type NodeMinAggregateOutputType = {
    id: string | null
    workflowId: string | null
    name: string | null
    type: $Enums.NodeType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NodeMaxAggregateOutputType = {
    id: string | null
    workflowId: string | null
    name: string | null
    type: $Enums.NodeType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NodeCountAggregateOutputType = {
    id: number
    workflowId: number
    name: number
    type: number
    position: number
    data: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NodeMinAggregateInputType = {
    id?: true
    workflowId?: true
    name?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NodeMaxAggregateInputType = {
    id?: true
    workflowId?: true
    name?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NodeCountAggregateInputType = {
    id?: true
    workflowId?: true
    name?: true
    type?: true
    position?: true
    data?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Node to aggregate.
     */
    where?: NodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nodes to fetch.
     */
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Nodes
    **/
    _count?: true | NodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NodeMaxAggregateInputType
  }

  export type GetNodeAggregateType<T extends NodeAggregateArgs> = {
        [P in keyof T & keyof AggregateNode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNode[P]>
      : GetScalarType<T[P], AggregateNode[P]>
  }




  export type NodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NodeWhereInput
    orderBy?: NodeOrderByWithAggregationInput | NodeOrderByWithAggregationInput[]
    by: NodeScalarFieldEnum[] | NodeScalarFieldEnum
    having?: NodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NodeCountAggregateInputType | true
    _min?: NodeMinAggregateInputType
    _max?: NodeMaxAggregateInputType
  }

  export type NodeGroupByOutputType = {
    id: string
    workflowId: string
    name: string
    type: $Enums.NodeType
    position: JsonValue
    data: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: NodeCountAggregateOutputType | null
    _min: NodeMinAggregateOutputType | null
    _max: NodeMaxAggregateOutputType | null
  }

  type GetNodeGroupByPayload<T extends NodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NodeGroupByOutputType[P]>
            : GetScalarType<T[P], NodeGroupByOutputType[P]>
        }
      >
    >


  export type NodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    name?: boolean
    type?: boolean
    position?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    fromConnections?: boolean | Node$fromConnectionsArgs<ExtArgs>
    toConnections?: boolean | Node$toConnectionsArgs<ExtArgs>
    executionSteps?: boolean | Node$executionStepsArgs<ExtArgs>
    _count?: boolean | NodeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["node"]>

  export type NodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    name?: boolean
    type?: boolean
    position?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["node"]>

  export type NodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    name?: boolean
    type?: boolean
    position?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["node"]>

  export type NodeSelectScalar = {
    id?: boolean
    workflowId?: boolean
    name?: boolean
    type?: boolean
    position?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workflowId" | "name" | "type" | "position" | "data" | "createdAt" | "updatedAt", ExtArgs["result"]["node"]>
  export type NodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    fromConnections?: boolean | Node$fromConnectionsArgs<ExtArgs>
    toConnections?: boolean | Node$toConnectionsArgs<ExtArgs>
    executionSteps?: boolean | Node$executionStepsArgs<ExtArgs>
    _count?: boolean | NodeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }
  export type NodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }

  export type $NodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Node"
    objects: {
      workflow: Prisma.$WorkflowPayload<ExtArgs>
      fromConnections: Prisma.$ConnectionPayload<ExtArgs>[]
      toConnections: Prisma.$ConnectionPayload<ExtArgs>[]
      executionSteps: Prisma.$ExecutionStepPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workflowId: string
      name: string
      type: $Enums.NodeType
      position: Prisma.JsonValue
      data: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["node"]>
    composites: {}
  }

  type NodeGetPayload<S extends boolean | null | undefined | NodeDefaultArgs> = $Result.GetResult<Prisma.$NodePayload, S>

  type NodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NodeCountAggregateInputType | true
    }

  export interface NodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Node'], meta: { name: 'Node' } }
    /**
     * Find zero or one Node that matches the filter.
     * @param {NodeFindUniqueArgs} args - Arguments to find a Node
     * @example
     * // Get one Node
     * const node = await prisma.node.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NodeFindUniqueArgs>(args: SelectSubset<T, NodeFindUniqueArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Node that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NodeFindUniqueOrThrowArgs} args - Arguments to find a Node
     * @example
     * // Get one Node
     * const node = await prisma.node.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NodeFindUniqueOrThrowArgs>(args: SelectSubset<T, NodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Node that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeFindFirstArgs} args - Arguments to find a Node
     * @example
     * // Get one Node
     * const node = await prisma.node.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NodeFindFirstArgs>(args?: SelectSubset<T, NodeFindFirstArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Node that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeFindFirstOrThrowArgs} args - Arguments to find a Node
     * @example
     * // Get one Node
     * const node = await prisma.node.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NodeFindFirstOrThrowArgs>(args?: SelectSubset<T, NodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Nodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Nodes
     * const nodes = await prisma.node.findMany()
     * 
     * // Get first 10 Nodes
     * const nodes = await prisma.node.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nodeWithIdOnly = await prisma.node.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NodeFindManyArgs>(args?: SelectSubset<T, NodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Node.
     * @param {NodeCreateArgs} args - Arguments to create a Node.
     * @example
     * // Create one Node
     * const Node = await prisma.node.create({
     *   data: {
     *     // ... data to create a Node
     *   }
     * })
     * 
     */
    create<T extends NodeCreateArgs>(args: SelectSubset<T, NodeCreateArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Nodes.
     * @param {NodeCreateManyArgs} args - Arguments to create many Nodes.
     * @example
     * // Create many Nodes
     * const node = await prisma.node.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NodeCreateManyArgs>(args?: SelectSubset<T, NodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Nodes and returns the data saved in the database.
     * @param {NodeCreateManyAndReturnArgs} args - Arguments to create many Nodes.
     * @example
     * // Create many Nodes
     * const node = await prisma.node.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Nodes and only return the `id`
     * const nodeWithIdOnly = await prisma.node.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NodeCreateManyAndReturnArgs>(args?: SelectSubset<T, NodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Node.
     * @param {NodeDeleteArgs} args - Arguments to delete one Node.
     * @example
     * // Delete one Node
     * const Node = await prisma.node.delete({
     *   where: {
     *     // ... filter to delete one Node
     *   }
     * })
     * 
     */
    delete<T extends NodeDeleteArgs>(args: SelectSubset<T, NodeDeleteArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Node.
     * @param {NodeUpdateArgs} args - Arguments to update one Node.
     * @example
     * // Update one Node
     * const node = await prisma.node.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NodeUpdateArgs>(args: SelectSubset<T, NodeUpdateArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Nodes.
     * @param {NodeDeleteManyArgs} args - Arguments to filter Nodes to delete.
     * @example
     * // Delete a few Nodes
     * const { count } = await prisma.node.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NodeDeleteManyArgs>(args?: SelectSubset<T, NodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Nodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Nodes
     * const node = await prisma.node.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NodeUpdateManyArgs>(args: SelectSubset<T, NodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Nodes and returns the data updated in the database.
     * @param {NodeUpdateManyAndReturnArgs} args - Arguments to update many Nodes.
     * @example
     * // Update many Nodes
     * const node = await prisma.node.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Nodes and only return the `id`
     * const nodeWithIdOnly = await prisma.node.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NodeUpdateManyAndReturnArgs>(args: SelectSubset<T, NodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Node.
     * @param {NodeUpsertArgs} args - Arguments to update or create a Node.
     * @example
     * // Update or create a Node
     * const node = await prisma.node.upsert({
     *   create: {
     *     // ... data to create a Node
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Node we want to update
     *   }
     * })
     */
    upsert<T extends NodeUpsertArgs>(args: SelectSubset<T, NodeUpsertArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Nodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeCountArgs} args - Arguments to filter Nodes to count.
     * @example
     * // Count the number of Nodes
     * const count = await prisma.node.count({
     *   where: {
     *     // ... the filter for the Nodes we want to count
     *   }
     * })
    **/
    count<T extends NodeCountArgs>(
      args?: Subset<T, NodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Node.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NodeAggregateArgs>(args: Subset<T, NodeAggregateArgs>): Prisma.PrismaPromise<GetNodeAggregateType<T>>

    /**
     * Group by Node.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NodeGroupByArgs['orderBy'] }
        : { orderBy?: NodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Node model
   */
  readonly fields: NodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Node.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workflow<T extends WorkflowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowDefaultArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    fromConnections<T extends Node$fromConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, Node$fromConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    toConnections<T extends Node$toConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, Node$toConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    executionSteps<T extends Node$executionStepsArgs<ExtArgs> = {}>(args?: Subset<T, Node$executionStepsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Node model
   */
  interface NodeFieldRefs {
    readonly id: FieldRef<"Node", 'String'>
    readonly workflowId: FieldRef<"Node", 'String'>
    readonly name: FieldRef<"Node", 'String'>
    readonly type: FieldRef<"Node", 'NodeType'>
    readonly position: FieldRef<"Node", 'Json'>
    readonly data: FieldRef<"Node", 'Json'>
    readonly createdAt: FieldRef<"Node", 'DateTime'>
    readonly updatedAt: FieldRef<"Node", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Node findUnique
   */
  export type NodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Node to fetch.
     */
    where: NodeWhereUniqueInput
  }

  /**
   * Node findUniqueOrThrow
   */
  export type NodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Node to fetch.
     */
    where: NodeWhereUniqueInput
  }

  /**
   * Node findFirst
   */
  export type NodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Node to fetch.
     */
    where?: NodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nodes to fetch.
     */
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Nodes.
     */
    cursor?: NodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Nodes.
     */
    distinct?: NodeScalarFieldEnum | NodeScalarFieldEnum[]
  }

  /**
   * Node findFirstOrThrow
   */
  export type NodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Node to fetch.
     */
    where?: NodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nodes to fetch.
     */
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Nodes.
     */
    cursor?: NodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Nodes.
     */
    distinct?: NodeScalarFieldEnum | NodeScalarFieldEnum[]
  }

  /**
   * Node findMany
   */
  export type NodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Nodes to fetch.
     */
    where?: NodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nodes to fetch.
     */
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Nodes.
     */
    cursor?: NodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nodes.
     */
    skip?: number
    distinct?: NodeScalarFieldEnum | NodeScalarFieldEnum[]
  }

  /**
   * Node create
   */
  export type NodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * The data needed to create a Node.
     */
    data: XOR<NodeCreateInput, NodeUncheckedCreateInput>
  }

  /**
   * Node createMany
   */
  export type NodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Nodes.
     */
    data: NodeCreateManyInput | NodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Node createManyAndReturn
   */
  export type NodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * The data used to create many Nodes.
     */
    data: NodeCreateManyInput | NodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Node update
   */
  export type NodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * The data needed to update a Node.
     */
    data: XOR<NodeUpdateInput, NodeUncheckedUpdateInput>
    /**
     * Choose, which Node to update.
     */
    where: NodeWhereUniqueInput
  }

  /**
   * Node updateMany
   */
  export type NodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Nodes.
     */
    data: XOR<NodeUpdateManyMutationInput, NodeUncheckedUpdateManyInput>
    /**
     * Filter which Nodes to update
     */
    where?: NodeWhereInput
    /**
     * Limit how many Nodes to update.
     */
    limit?: number
  }

  /**
   * Node updateManyAndReturn
   */
  export type NodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * The data used to update Nodes.
     */
    data: XOR<NodeUpdateManyMutationInput, NodeUncheckedUpdateManyInput>
    /**
     * Filter which Nodes to update
     */
    where?: NodeWhereInput
    /**
     * Limit how many Nodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Node upsert
   */
  export type NodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * The filter to search for the Node to update in case it exists.
     */
    where: NodeWhereUniqueInput
    /**
     * In case the Node found by the `where` argument doesn't exist, create a new Node with this data.
     */
    create: XOR<NodeCreateInput, NodeUncheckedCreateInput>
    /**
     * In case the Node was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NodeUpdateInput, NodeUncheckedUpdateInput>
  }

  /**
   * Node delete
   */
  export type NodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter which Node to delete.
     */
    where: NodeWhereUniqueInput
  }

  /**
   * Node deleteMany
   */
  export type NodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Nodes to delete
     */
    where?: NodeWhereInput
    /**
     * Limit how many Nodes to delete.
     */
    limit?: number
  }

  /**
   * Node.fromConnections
   */
  export type Node$fromConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    where?: ConnectionWhereInput
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    cursor?: ConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Node.toConnections
   */
  export type Node$toConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    where?: ConnectionWhereInput
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    cursor?: ConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Node.executionSteps
   */
  export type Node$executionStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    where?: ExecutionStepWhereInput
    orderBy?: ExecutionStepOrderByWithRelationInput | ExecutionStepOrderByWithRelationInput[]
    cursor?: ExecutionStepWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExecutionStepScalarFieldEnum | ExecutionStepScalarFieldEnum[]
  }

  /**
   * Node without action
   */
  export type NodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
  }


  /**
   * Model Connection
   */

  export type AggregateConnection = {
    _count: ConnectionCountAggregateOutputType | null
    _min: ConnectionMinAggregateOutputType | null
    _max: ConnectionMaxAggregateOutputType | null
  }

  export type ConnectionMinAggregateOutputType = {
    id: string | null
    workflowId: string | null
    fromNodeId: string | null
    fromOutput: string | null
    toNodeId: string | null
    toInput: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConnectionMaxAggregateOutputType = {
    id: string | null
    workflowId: string | null
    fromNodeId: string | null
    fromOutput: string | null
    toNodeId: string | null
    toInput: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConnectionCountAggregateOutputType = {
    id: number
    workflowId: number
    fromNodeId: number
    fromOutput: number
    toNodeId: number
    toInput: number
    data: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConnectionMinAggregateInputType = {
    id?: true
    workflowId?: true
    fromNodeId?: true
    fromOutput?: true
    toNodeId?: true
    toInput?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConnectionMaxAggregateInputType = {
    id?: true
    workflowId?: true
    fromNodeId?: true
    fromOutput?: true
    toNodeId?: true
    toInput?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConnectionCountAggregateInputType = {
    id?: true
    workflowId?: true
    fromNodeId?: true
    fromOutput?: true
    toNodeId?: true
    toInput?: true
    data?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConnectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Connection to aggregate.
     */
    where?: ConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Connections to fetch.
     */
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Connections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Connections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Connections
    **/
    _count?: true | ConnectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConnectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConnectionMaxAggregateInputType
  }

  export type GetConnectionAggregateType<T extends ConnectionAggregateArgs> = {
        [P in keyof T & keyof AggregateConnection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConnection[P]>
      : GetScalarType<T[P], AggregateConnection[P]>
  }




  export type ConnectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConnectionWhereInput
    orderBy?: ConnectionOrderByWithAggregationInput | ConnectionOrderByWithAggregationInput[]
    by: ConnectionScalarFieldEnum[] | ConnectionScalarFieldEnum
    having?: ConnectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConnectionCountAggregateInputType | true
    _min?: ConnectionMinAggregateInputType
    _max?: ConnectionMaxAggregateInputType
  }

  export type ConnectionGroupByOutputType = {
    id: string
    workflowId: string
    fromNodeId: string
    fromOutput: string
    toNodeId: string
    toInput: string
    data: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: ConnectionCountAggregateOutputType | null
    _min: ConnectionMinAggregateOutputType | null
    _max: ConnectionMaxAggregateOutputType | null
  }

  type GetConnectionGroupByPayload<T extends ConnectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConnectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConnectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConnectionGroupByOutputType[P]>
            : GetScalarType<T[P], ConnectionGroupByOutputType[P]>
        }
      >
    >


  export type ConnectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    fromNodeId?: boolean
    fromOutput?: boolean
    toNodeId?: boolean
    toInput?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    fromNode?: boolean | NodeDefaultArgs<ExtArgs>
    toNode?: boolean | NodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["connection"]>

  export type ConnectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    fromNodeId?: boolean
    fromOutput?: boolean
    toNodeId?: boolean
    toInput?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    fromNode?: boolean | NodeDefaultArgs<ExtArgs>
    toNode?: boolean | NodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["connection"]>

  export type ConnectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    fromNodeId?: boolean
    fromOutput?: boolean
    toNodeId?: boolean
    toInput?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    fromNode?: boolean | NodeDefaultArgs<ExtArgs>
    toNode?: boolean | NodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["connection"]>

  export type ConnectionSelectScalar = {
    id?: boolean
    workflowId?: boolean
    fromNodeId?: boolean
    fromOutput?: boolean
    toNodeId?: boolean
    toInput?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConnectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workflowId" | "fromNodeId" | "fromOutput" | "toNodeId" | "toInput" | "data" | "createdAt" | "updatedAt", ExtArgs["result"]["connection"]>
  export type ConnectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    fromNode?: boolean | NodeDefaultArgs<ExtArgs>
    toNode?: boolean | NodeDefaultArgs<ExtArgs>
  }
  export type ConnectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    fromNode?: boolean | NodeDefaultArgs<ExtArgs>
    toNode?: boolean | NodeDefaultArgs<ExtArgs>
  }
  export type ConnectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    fromNode?: boolean | NodeDefaultArgs<ExtArgs>
    toNode?: boolean | NodeDefaultArgs<ExtArgs>
  }

  export type $ConnectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Connection"
    objects: {
      workflow: Prisma.$WorkflowPayload<ExtArgs>
      fromNode: Prisma.$NodePayload<ExtArgs>
      toNode: Prisma.$NodePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workflowId: string
      fromNodeId: string
      fromOutput: string
      toNodeId: string
      toInput: string
      data: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["connection"]>
    composites: {}
  }

  type ConnectionGetPayload<S extends boolean | null | undefined | ConnectionDefaultArgs> = $Result.GetResult<Prisma.$ConnectionPayload, S>

  type ConnectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConnectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConnectionCountAggregateInputType | true
    }

  export interface ConnectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Connection'], meta: { name: 'Connection' } }
    /**
     * Find zero or one Connection that matches the filter.
     * @param {ConnectionFindUniqueArgs} args - Arguments to find a Connection
     * @example
     * // Get one Connection
     * const connection = await prisma.connection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConnectionFindUniqueArgs>(args: SelectSubset<T, ConnectionFindUniqueArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Connection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConnectionFindUniqueOrThrowArgs} args - Arguments to find a Connection
     * @example
     * // Get one Connection
     * const connection = await prisma.connection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConnectionFindUniqueOrThrowArgs>(args: SelectSubset<T, ConnectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Connection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionFindFirstArgs} args - Arguments to find a Connection
     * @example
     * // Get one Connection
     * const connection = await prisma.connection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConnectionFindFirstArgs>(args?: SelectSubset<T, ConnectionFindFirstArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Connection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionFindFirstOrThrowArgs} args - Arguments to find a Connection
     * @example
     * // Get one Connection
     * const connection = await prisma.connection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConnectionFindFirstOrThrowArgs>(args?: SelectSubset<T, ConnectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Connections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Connections
     * const connections = await prisma.connection.findMany()
     * 
     * // Get first 10 Connections
     * const connections = await prisma.connection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const connectionWithIdOnly = await prisma.connection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConnectionFindManyArgs>(args?: SelectSubset<T, ConnectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Connection.
     * @param {ConnectionCreateArgs} args - Arguments to create a Connection.
     * @example
     * // Create one Connection
     * const Connection = await prisma.connection.create({
     *   data: {
     *     // ... data to create a Connection
     *   }
     * })
     * 
     */
    create<T extends ConnectionCreateArgs>(args: SelectSubset<T, ConnectionCreateArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Connections.
     * @param {ConnectionCreateManyArgs} args - Arguments to create many Connections.
     * @example
     * // Create many Connections
     * const connection = await prisma.connection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConnectionCreateManyArgs>(args?: SelectSubset<T, ConnectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Connections and returns the data saved in the database.
     * @param {ConnectionCreateManyAndReturnArgs} args - Arguments to create many Connections.
     * @example
     * // Create many Connections
     * const connection = await prisma.connection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Connections and only return the `id`
     * const connectionWithIdOnly = await prisma.connection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConnectionCreateManyAndReturnArgs>(args?: SelectSubset<T, ConnectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Connection.
     * @param {ConnectionDeleteArgs} args - Arguments to delete one Connection.
     * @example
     * // Delete one Connection
     * const Connection = await prisma.connection.delete({
     *   where: {
     *     // ... filter to delete one Connection
     *   }
     * })
     * 
     */
    delete<T extends ConnectionDeleteArgs>(args: SelectSubset<T, ConnectionDeleteArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Connection.
     * @param {ConnectionUpdateArgs} args - Arguments to update one Connection.
     * @example
     * // Update one Connection
     * const connection = await prisma.connection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConnectionUpdateArgs>(args: SelectSubset<T, ConnectionUpdateArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Connections.
     * @param {ConnectionDeleteManyArgs} args - Arguments to filter Connections to delete.
     * @example
     * // Delete a few Connections
     * const { count } = await prisma.connection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConnectionDeleteManyArgs>(args?: SelectSubset<T, ConnectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Connections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Connections
     * const connection = await prisma.connection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConnectionUpdateManyArgs>(args: SelectSubset<T, ConnectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Connections and returns the data updated in the database.
     * @param {ConnectionUpdateManyAndReturnArgs} args - Arguments to update many Connections.
     * @example
     * // Update many Connections
     * const connection = await prisma.connection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Connections and only return the `id`
     * const connectionWithIdOnly = await prisma.connection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConnectionUpdateManyAndReturnArgs>(args: SelectSubset<T, ConnectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Connection.
     * @param {ConnectionUpsertArgs} args - Arguments to update or create a Connection.
     * @example
     * // Update or create a Connection
     * const connection = await prisma.connection.upsert({
     *   create: {
     *     // ... data to create a Connection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Connection we want to update
     *   }
     * })
     */
    upsert<T extends ConnectionUpsertArgs>(args: SelectSubset<T, ConnectionUpsertArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Connections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionCountArgs} args - Arguments to filter Connections to count.
     * @example
     * // Count the number of Connections
     * const count = await prisma.connection.count({
     *   where: {
     *     // ... the filter for the Connections we want to count
     *   }
     * })
    **/
    count<T extends ConnectionCountArgs>(
      args?: Subset<T, ConnectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConnectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Connection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConnectionAggregateArgs>(args: Subset<T, ConnectionAggregateArgs>): Prisma.PrismaPromise<GetConnectionAggregateType<T>>

    /**
     * Group by Connection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConnectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConnectionGroupByArgs['orderBy'] }
        : { orderBy?: ConnectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConnectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConnectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Connection model
   */
  readonly fields: ConnectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Connection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConnectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workflow<T extends WorkflowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowDefaultArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    fromNode<T extends NodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NodeDefaultArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    toNode<T extends NodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NodeDefaultArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Connection model
   */
  interface ConnectionFieldRefs {
    readonly id: FieldRef<"Connection", 'String'>
    readonly workflowId: FieldRef<"Connection", 'String'>
    readonly fromNodeId: FieldRef<"Connection", 'String'>
    readonly fromOutput: FieldRef<"Connection", 'String'>
    readonly toNodeId: FieldRef<"Connection", 'String'>
    readonly toInput: FieldRef<"Connection", 'String'>
    readonly data: FieldRef<"Connection", 'Json'>
    readonly createdAt: FieldRef<"Connection", 'DateTime'>
    readonly updatedAt: FieldRef<"Connection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Connection findUnique
   */
  export type ConnectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connection to fetch.
     */
    where: ConnectionWhereUniqueInput
  }

  /**
   * Connection findUniqueOrThrow
   */
  export type ConnectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connection to fetch.
     */
    where: ConnectionWhereUniqueInput
  }

  /**
   * Connection findFirst
   */
  export type ConnectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connection to fetch.
     */
    where?: ConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Connections to fetch.
     */
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Connections.
     */
    cursor?: ConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Connections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Connections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Connections.
     */
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Connection findFirstOrThrow
   */
  export type ConnectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connection to fetch.
     */
    where?: ConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Connections to fetch.
     */
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Connections.
     */
    cursor?: ConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Connections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Connections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Connections.
     */
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Connection findMany
   */
  export type ConnectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connections to fetch.
     */
    where?: ConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Connections to fetch.
     */
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Connections.
     */
    cursor?: ConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Connections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Connections.
     */
    skip?: number
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Connection create
   */
  export type ConnectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Connection.
     */
    data: XOR<ConnectionCreateInput, ConnectionUncheckedCreateInput>
  }

  /**
   * Connection createMany
   */
  export type ConnectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Connections.
     */
    data: ConnectionCreateManyInput | ConnectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Connection createManyAndReturn
   */
  export type ConnectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * The data used to create many Connections.
     */
    data: ConnectionCreateManyInput | ConnectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Connection update
   */
  export type ConnectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Connection.
     */
    data: XOR<ConnectionUpdateInput, ConnectionUncheckedUpdateInput>
    /**
     * Choose, which Connection to update.
     */
    where: ConnectionWhereUniqueInput
  }

  /**
   * Connection updateMany
   */
  export type ConnectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Connections.
     */
    data: XOR<ConnectionUpdateManyMutationInput, ConnectionUncheckedUpdateManyInput>
    /**
     * Filter which Connections to update
     */
    where?: ConnectionWhereInput
    /**
     * Limit how many Connections to update.
     */
    limit?: number
  }

  /**
   * Connection updateManyAndReturn
   */
  export type ConnectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * The data used to update Connections.
     */
    data: XOR<ConnectionUpdateManyMutationInput, ConnectionUncheckedUpdateManyInput>
    /**
     * Filter which Connections to update
     */
    where?: ConnectionWhereInput
    /**
     * Limit how many Connections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Connection upsert
   */
  export type ConnectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Connection to update in case it exists.
     */
    where: ConnectionWhereUniqueInput
    /**
     * In case the Connection found by the `where` argument doesn't exist, create a new Connection with this data.
     */
    create: XOR<ConnectionCreateInput, ConnectionUncheckedCreateInput>
    /**
     * In case the Connection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConnectionUpdateInput, ConnectionUncheckedUpdateInput>
  }

  /**
   * Connection delete
   */
  export type ConnectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter which Connection to delete.
     */
    where: ConnectionWhereUniqueInput
  }

  /**
   * Connection deleteMany
   */
  export type ConnectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Connections to delete
     */
    where?: ConnectionWhereInput
    /**
     * Limit how many Connections to delete.
     */
    limit?: number
  }

  /**
   * Connection without action
   */
  export type ConnectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
  }


  /**
   * Model Credential
   */

  export type AggregateCredential = {
    _count: CredentialCountAggregateOutputType | null
    _min: CredentialMinAggregateOutputType | null
    _max: CredentialMaxAggregateOutputType | null
  }

  export type CredentialMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    provider: $Enums.CredentialProvider | null
    description: string | null
    encryptedData: string | null
    lastUsedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CredentialMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    provider: $Enums.CredentialProvider | null
    description: string | null
    encryptedData: string | null
    lastUsedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CredentialCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    provider: number
    description: number
    encryptedData: number
    metadata: number
    lastUsedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CredentialMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    provider?: true
    description?: true
    encryptedData?: true
    lastUsedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CredentialMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    provider?: true
    description?: true
    encryptedData?: true
    lastUsedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CredentialCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    provider?: true
    description?: true
    encryptedData?: true
    metadata?: true
    lastUsedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CredentialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Credential to aggregate.
     */
    where?: CredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credentials to fetch.
     */
    orderBy?: CredentialOrderByWithRelationInput | CredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Credentials
    **/
    _count?: true | CredentialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CredentialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CredentialMaxAggregateInputType
  }

  export type GetCredentialAggregateType<T extends CredentialAggregateArgs> = {
        [P in keyof T & keyof AggregateCredential]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCredential[P]>
      : GetScalarType<T[P], AggregateCredential[P]>
  }




  export type CredentialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CredentialWhereInput
    orderBy?: CredentialOrderByWithAggregationInput | CredentialOrderByWithAggregationInput[]
    by: CredentialScalarFieldEnum[] | CredentialScalarFieldEnum
    having?: CredentialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CredentialCountAggregateInputType | true
    _min?: CredentialMinAggregateInputType
    _max?: CredentialMaxAggregateInputType
  }

  export type CredentialGroupByOutputType = {
    id: string
    userId: string
    name: string
    provider: $Enums.CredentialProvider
    description: string | null
    encryptedData: string
    metadata: JsonValue
    lastUsedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: CredentialCountAggregateOutputType | null
    _min: CredentialMinAggregateOutputType | null
    _max: CredentialMaxAggregateOutputType | null
  }

  type GetCredentialGroupByPayload<T extends CredentialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CredentialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CredentialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CredentialGroupByOutputType[P]>
            : GetScalarType<T[P], CredentialGroupByOutputType[P]>
        }
      >
    >


  export type CredentialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    provider?: boolean
    description?: boolean
    encryptedData?: boolean
    metadata?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credential"]>

  export type CredentialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    provider?: boolean
    description?: boolean
    encryptedData?: boolean
    metadata?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credential"]>

  export type CredentialSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    provider?: boolean
    description?: boolean
    encryptedData?: boolean
    metadata?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credential"]>

  export type CredentialSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    provider?: boolean
    description?: boolean
    encryptedData?: boolean
    metadata?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CredentialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "provider" | "description" | "encryptedData" | "metadata" | "lastUsedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["credential"]>
  export type CredentialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CredentialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CredentialIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CredentialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Credential"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      provider: $Enums.CredentialProvider
      description: string | null
      encryptedData: string
      metadata: Prisma.JsonValue
      lastUsedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["credential"]>
    composites: {}
  }

  type CredentialGetPayload<S extends boolean | null | undefined | CredentialDefaultArgs> = $Result.GetResult<Prisma.$CredentialPayload, S>

  type CredentialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CredentialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CredentialCountAggregateInputType | true
    }

  export interface CredentialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Credential'], meta: { name: 'Credential' } }
    /**
     * Find zero or one Credential that matches the filter.
     * @param {CredentialFindUniqueArgs} args - Arguments to find a Credential
     * @example
     * // Get one Credential
     * const credential = await prisma.credential.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CredentialFindUniqueArgs>(args: SelectSubset<T, CredentialFindUniqueArgs<ExtArgs>>): Prisma__CredentialClient<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Credential that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CredentialFindUniqueOrThrowArgs} args - Arguments to find a Credential
     * @example
     * // Get one Credential
     * const credential = await prisma.credential.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CredentialFindUniqueOrThrowArgs>(args: SelectSubset<T, CredentialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CredentialClient<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Credential that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialFindFirstArgs} args - Arguments to find a Credential
     * @example
     * // Get one Credential
     * const credential = await prisma.credential.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CredentialFindFirstArgs>(args?: SelectSubset<T, CredentialFindFirstArgs<ExtArgs>>): Prisma__CredentialClient<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Credential that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialFindFirstOrThrowArgs} args - Arguments to find a Credential
     * @example
     * // Get one Credential
     * const credential = await prisma.credential.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CredentialFindFirstOrThrowArgs>(args?: SelectSubset<T, CredentialFindFirstOrThrowArgs<ExtArgs>>): Prisma__CredentialClient<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Credentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Credentials
     * const credentials = await prisma.credential.findMany()
     * 
     * // Get first 10 Credentials
     * const credentials = await prisma.credential.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const credentialWithIdOnly = await prisma.credential.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CredentialFindManyArgs>(args?: SelectSubset<T, CredentialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Credential.
     * @param {CredentialCreateArgs} args - Arguments to create a Credential.
     * @example
     * // Create one Credential
     * const Credential = await prisma.credential.create({
     *   data: {
     *     // ... data to create a Credential
     *   }
     * })
     * 
     */
    create<T extends CredentialCreateArgs>(args: SelectSubset<T, CredentialCreateArgs<ExtArgs>>): Prisma__CredentialClient<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Credentials.
     * @param {CredentialCreateManyArgs} args - Arguments to create many Credentials.
     * @example
     * // Create many Credentials
     * const credential = await prisma.credential.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CredentialCreateManyArgs>(args?: SelectSubset<T, CredentialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Credentials and returns the data saved in the database.
     * @param {CredentialCreateManyAndReturnArgs} args - Arguments to create many Credentials.
     * @example
     * // Create many Credentials
     * const credential = await prisma.credential.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Credentials and only return the `id`
     * const credentialWithIdOnly = await prisma.credential.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CredentialCreateManyAndReturnArgs>(args?: SelectSubset<T, CredentialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Credential.
     * @param {CredentialDeleteArgs} args - Arguments to delete one Credential.
     * @example
     * // Delete one Credential
     * const Credential = await prisma.credential.delete({
     *   where: {
     *     // ... filter to delete one Credential
     *   }
     * })
     * 
     */
    delete<T extends CredentialDeleteArgs>(args: SelectSubset<T, CredentialDeleteArgs<ExtArgs>>): Prisma__CredentialClient<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Credential.
     * @param {CredentialUpdateArgs} args - Arguments to update one Credential.
     * @example
     * // Update one Credential
     * const credential = await prisma.credential.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CredentialUpdateArgs>(args: SelectSubset<T, CredentialUpdateArgs<ExtArgs>>): Prisma__CredentialClient<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Credentials.
     * @param {CredentialDeleteManyArgs} args - Arguments to filter Credentials to delete.
     * @example
     * // Delete a few Credentials
     * const { count } = await prisma.credential.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CredentialDeleteManyArgs>(args?: SelectSubset<T, CredentialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Credentials
     * const credential = await prisma.credential.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CredentialUpdateManyArgs>(args: SelectSubset<T, CredentialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Credentials and returns the data updated in the database.
     * @param {CredentialUpdateManyAndReturnArgs} args - Arguments to update many Credentials.
     * @example
     * // Update many Credentials
     * const credential = await prisma.credential.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Credentials and only return the `id`
     * const credentialWithIdOnly = await prisma.credential.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CredentialUpdateManyAndReturnArgs>(args: SelectSubset<T, CredentialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Credential.
     * @param {CredentialUpsertArgs} args - Arguments to update or create a Credential.
     * @example
     * // Update or create a Credential
     * const credential = await prisma.credential.upsert({
     *   create: {
     *     // ... data to create a Credential
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Credential we want to update
     *   }
     * })
     */
    upsert<T extends CredentialUpsertArgs>(args: SelectSubset<T, CredentialUpsertArgs<ExtArgs>>): Prisma__CredentialClient<$Result.GetResult<Prisma.$CredentialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialCountArgs} args - Arguments to filter Credentials to count.
     * @example
     * // Count the number of Credentials
     * const count = await prisma.credential.count({
     *   where: {
     *     // ... the filter for the Credentials we want to count
     *   }
     * })
    **/
    count<T extends CredentialCountArgs>(
      args?: Subset<T, CredentialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CredentialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Credential.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CredentialAggregateArgs>(args: Subset<T, CredentialAggregateArgs>): Prisma.PrismaPromise<GetCredentialAggregateType<T>>

    /**
     * Group by Credential.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CredentialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CredentialGroupByArgs['orderBy'] }
        : { orderBy?: CredentialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CredentialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCredentialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Credential model
   */
  readonly fields: CredentialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Credential.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CredentialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Credential model
   */
  interface CredentialFieldRefs {
    readonly id: FieldRef<"Credential", 'String'>
    readonly userId: FieldRef<"Credential", 'String'>
    readonly name: FieldRef<"Credential", 'String'>
    readonly provider: FieldRef<"Credential", 'CredentialProvider'>
    readonly description: FieldRef<"Credential", 'String'>
    readonly encryptedData: FieldRef<"Credential", 'String'>
    readonly metadata: FieldRef<"Credential", 'Json'>
    readonly lastUsedAt: FieldRef<"Credential", 'DateTime'>
    readonly createdAt: FieldRef<"Credential", 'DateTime'>
    readonly updatedAt: FieldRef<"Credential", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Credential findUnique
   */
  export type CredentialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * Filter, which Credential to fetch.
     */
    where: CredentialWhereUniqueInput
  }

  /**
   * Credential findUniqueOrThrow
   */
  export type CredentialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * Filter, which Credential to fetch.
     */
    where: CredentialWhereUniqueInput
  }

  /**
   * Credential findFirst
   */
  export type CredentialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * Filter, which Credential to fetch.
     */
    where?: CredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credentials to fetch.
     */
    orderBy?: CredentialOrderByWithRelationInput | CredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Credentials.
     */
    cursor?: CredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Credentials.
     */
    distinct?: CredentialScalarFieldEnum | CredentialScalarFieldEnum[]
  }

  /**
   * Credential findFirstOrThrow
   */
  export type CredentialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * Filter, which Credential to fetch.
     */
    where?: CredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credentials to fetch.
     */
    orderBy?: CredentialOrderByWithRelationInput | CredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Credentials.
     */
    cursor?: CredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Credentials.
     */
    distinct?: CredentialScalarFieldEnum | CredentialScalarFieldEnum[]
  }

  /**
   * Credential findMany
   */
  export type CredentialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * Filter, which Credentials to fetch.
     */
    where?: CredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credentials to fetch.
     */
    orderBy?: CredentialOrderByWithRelationInput | CredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Credentials.
     */
    cursor?: CredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credentials.
     */
    skip?: number
    distinct?: CredentialScalarFieldEnum | CredentialScalarFieldEnum[]
  }

  /**
   * Credential create
   */
  export type CredentialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * The data needed to create a Credential.
     */
    data: XOR<CredentialCreateInput, CredentialUncheckedCreateInput>
  }

  /**
   * Credential createMany
   */
  export type CredentialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Credentials.
     */
    data: CredentialCreateManyInput | CredentialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Credential createManyAndReturn
   */
  export type CredentialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * The data used to create many Credentials.
     */
    data: CredentialCreateManyInput | CredentialCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Credential update
   */
  export type CredentialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * The data needed to update a Credential.
     */
    data: XOR<CredentialUpdateInput, CredentialUncheckedUpdateInput>
    /**
     * Choose, which Credential to update.
     */
    where: CredentialWhereUniqueInput
  }

  /**
   * Credential updateMany
   */
  export type CredentialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Credentials.
     */
    data: XOR<CredentialUpdateManyMutationInput, CredentialUncheckedUpdateManyInput>
    /**
     * Filter which Credentials to update
     */
    where?: CredentialWhereInput
    /**
     * Limit how many Credentials to update.
     */
    limit?: number
  }

  /**
   * Credential updateManyAndReturn
   */
  export type CredentialUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * The data used to update Credentials.
     */
    data: XOR<CredentialUpdateManyMutationInput, CredentialUncheckedUpdateManyInput>
    /**
     * Filter which Credentials to update
     */
    where?: CredentialWhereInput
    /**
     * Limit how many Credentials to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Credential upsert
   */
  export type CredentialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * The filter to search for the Credential to update in case it exists.
     */
    where: CredentialWhereUniqueInput
    /**
     * In case the Credential found by the `where` argument doesn't exist, create a new Credential with this data.
     */
    create: XOR<CredentialCreateInput, CredentialUncheckedCreateInput>
    /**
     * In case the Credential was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CredentialUpdateInput, CredentialUncheckedUpdateInput>
  }

  /**
   * Credential delete
   */
  export type CredentialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
    /**
     * Filter which Credential to delete.
     */
    where: CredentialWhereUniqueInput
  }

  /**
   * Credential deleteMany
   */
  export type CredentialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Credentials to delete
     */
    where?: CredentialWhereInput
    /**
     * Limit how many Credentials to delete.
     */
    limit?: number
  }

  /**
   * Credential without action
   */
  export type CredentialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credential
     */
    select?: CredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credential
     */
    omit?: CredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialInclude<ExtArgs> | null
  }


  /**
   * Model Execution
   */

  export type AggregateExecution = {
    _count: ExecutionCountAggregateOutputType | null
    _min: ExecutionMinAggregateOutputType | null
    _max: ExecutionMaxAggregateOutputType | null
  }

  export type ExecutionMinAggregateOutputType = {
    id: string | null
    workflowId: string | null
    triggerType: $Enums.ExecutionTriggerType | null
    status: $Enums.ExecutionStatus | null
    triggeredByUserId: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExecutionMaxAggregateOutputType = {
    id: string | null
    workflowId: string | null
    triggerType: $Enums.ExecutionTriggerType | null
    status: $Enums.ExecutionStatus | null
    triggeredByUserId: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExecutionCountAggregateOutputType = {
    id: number
    workflowId: number
    triggerType: number
    status: number
    triggeredByUserId: number
    triggerPayload: number
    state: number
    workflowSnapshot: number
    startedAt: number
    completedAt: number
    error: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExecutionMinAggregateInputType = {
    id?: true
    workflowId?: true
    triggerType?: true
    status?: true
    triggeredByUserId?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExecutionMaxAggregateInputType = {
    id?: true
    workflowId?: true
    triggerType?: true
    status?: true
    triggeredByUserId?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExecutionCountAggregateInputType = {
    id?: true
    workflowId?: true
    triggerType?: true
    status?: true
    triggeredByUserId?: true
    triggerPayload?: true
    state?: true
    workflowSnapshot?: true
    startedAt?: true
    completedAt?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExecutionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Execution to aggregate.
     */
    where?: ExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Executions to fetch.
     */
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Executions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Executions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Executions
    **/
    _count?: true | ExecutionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExecutionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExecutionMaxAggregateInputType
  }

  export type GetExecutionAggregateType<T extends ExecutionAggregateArgs> = {
        [P in keyof T & keyof AggregateExecution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExecution[P]>
      : GetScalarType<T[P], AggregateExecution[P]>
  }




  export type ExecutionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionWhereInput
    orderBy?: ExecutionOrderByWithAggregationInput | ExecutionOrderByWithAggregationInput[]
    by: ExecutionScalarFieldEnum[] | ExecutionScalarFieldEnum
    having?: ExecutionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExecutionCountAggregateInputType | true
    _min?: ExecutionMinAggregateInputType
    _max?: ExecutionMaxAggregateInputType
  }

  export type ExecutionGroupByOutputType = {
    id: string
    workflowId: string
    triggerType: $Enums.ExecutionTriggerType
    status: $Enums.ExecutionStatus
    triggeredByUserId: string | null
    triggerPayload: JsonValue
    state: JsonValue
    workflowSnapshot: JsonValue | null
    startedAt: Date | null
    completedAt: Date | null
    error: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ExecutionCountAggregateOutputType | null
    _min: ExecutionMinAggregateOutputType | null
    _max: ExecutionMaxAggregateOutputType | null
  }

  type GetExecutionGroupByPayload<T extends ExecutionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExecutionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExecutionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExecutionGroupByOutputType[P]>
            : GetScalarType<T[P], ExecutionGroupByOutputType[P]>
        }
      >
    >


  export type ExecutionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    triggerType?: boolean
    status?: boolean
    triggeredByUserId?: boolean
    triggerPayload?: boolean
    state?: boolean
    workflowSnapshot?: boolean
    startedAt?: boolean
    completedAt?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    triggeredByUser?: boolean | Execution$triggeredByUserArgs<ExtArgs>
    steps?: boolean | Execution$stepsArgs<ExtArgs>
    _count?: boolean | ExecutionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["execution"]>

  export type ExecutionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    triggerType?: boolean
    status?: boolean
    triggeredByUserId?: boolean
    triggerPayload?: boolean
    state?: boolean
    workflowSnapshot?: boolean
    startedAt?: boolean
    completedAt?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    triggeredByUser?: boolean | Execution$triggeredByUserArgs<ExtArgs>
  }, ExtArgs["result"]["execution"]>

  export type ExecutionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    triggerType?: boolean
    status?: boolean
    triggeredByUserId?: boolean
    triggerPayload?: boolean
    state?: boolean
    workflowSnapshot?: boolean
    startedAt?: boolean
    completedAt?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    triggeredByUser?: boolean | Execution$triggeredByUserArgs<ExtArgs>
  }, ExtArgs["result"]["execution"]>

  export type ExecutionSelectScalar = {
    id?: boolean
    workflowId?: boolean
    triggerType?: boolean
    status?: boolean
    triggeredByUserId?: boolean
    triggerPayload?: boolean
    state?: boolean
    workflowSnapshot?: boolean
    startedAt?: boolean
    completedAt?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExecutionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workflowId" | "triggerType" | "status" | "triggeredByUserId" | "triggerPayload" | "state" | "workflowSnapshot" | "startedAt" | "completedAt" | "error" | "createdAt" | "updatedAt", ExtArgs["result"]["execution"]>
  export type ExecutionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    triggeredByUser?: boolean | Execution$triggeredByUserArgs<ExtArgs>
    steps?: boolean | Execution$stepsArgs<ExtArgs>
    _count?: boolean | ExecutionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExecutionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    triggeredByUser?: boolean | Execution$triggeredByUserArgs<ExtArgs>
  }
  export type ExecutionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    triggeredByUser?: boolean | Execution$triggeredByUserArgs<ExtArgs>
  }

  export type $ExecutionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Execution"
    objects: {
      workflow: Prisma.$WorkflowPayload<ExtArgs>
      triggeredByUser: Prisma.$UserPayload<ExtArgs> | null
      steps: Prisma.$ExecutionStepPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workflowId: string
      triggerType: $Enums.ExecutionTriggerType
      status: $Enums.ExecutionStatus
      triggeredByUserId: string | null
      triggerPayload: Prisma.JsonValue
      state: Prisma.JsonValue
      workflowSnapshot: Prisma.JsonValue | null
      startedAt: Date | null
      completedAt: Date | null
      error: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["execution"]>
    composites: {}
  }

  type ExecutionGetPayload<S extends boolean | null | undefined | ExecutionDefaultArgs> = $Result.GetResult<Prisma.$ExecutionPayload, S>

  type ExecutionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExecutionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExecutionCountAggregateInputType | true
    }

  export interface ExecutionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Execution'], meta: { name: 'Execution' } }
    /**
     * Find zero or one Execution that matches the filter.
     * @param {ExecutionFindUniqueArgs} args - Arguments to find a Execution
     * @example
     * // Get one Execution
     * const execution = await prisma.execution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExecutionFindUniqueArgs>(args: SelectSubset<T, ExecutionFindUniqueArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Execution that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExecutionFindUniqueOrThrowArgs} args - Arguments to find a Execution
     * @example
     * // Get one Execution
     * const execution = await prisma.execution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExecutionFindUniqueOrThrowArgs>(args: SelectSubset<T, ExecutionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Execution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionFindFirstArgs} args - Arguments to find a Execution
     * @example
     * // Get one Execution
     * const execution = await prisma.execution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExecutionFindFirstArgs>(args?: SelectSubset<T, ExecutionFindFirstArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Execution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionFindFirstOrThrowArgs} args - Arguments to find a Execution
     * @example
     * // Get one Execution
     * const execution = await prisma.execution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExecutionFindFirstOrThrowArgs>(args?: SelectSubset<T, ExecutionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Executions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Executions
     * const executions = await prisma.execution.findMany()
     * 
     * // Get first 10 Executions
     * const executions = await prisma.execution.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const executionWithIdOnly = await prisma.execution.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExecutionFindManyArgs>(args?: SelectSubset<T, ExecutionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Execution.
     * @param {ExecutionCreateArgs} args - Arguments to create a Execution.
     * @example
     * // Create one Execution
     * const Execution = await prisma.execution.create({
     *   data: {
     *     // ... data to create a Execution
     *   }
     * })
     * 
     */
    create<T extends ExecutionCreateArgs>(args: SelectSubset<T, ExecutionCreateArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Executions.
     * @param {ExecutionCreateManyArgs} args - Arguments to create many Executions.
     * @example
     * // Create many Executions
     * const execution = await prisma.execution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExecutionCreateManyArgs>(args?: SelectSubset<T, ExecutionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Executions and returns the data saved in the database.
     * @param {ExecutionCreateManyAndReturnArgs} args - Arguments to create many Executions.
     * @example
     * // Create many Executions
     * const execution = await prisma.execution.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Executions and only return the `id`
     * const executionWithIdOnly = await prisma.execution.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExecutionCreateManyAndReturnArgs>(args?: SelectSubset<T, ExecutionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Execution.
     * @param {ExecutionDeleteArgs} args - Arguments to delete one Execution.
     * @example
     * // Delete one Execution
     * const Execution = await prisma.execution.delete({
     *   where: {
     *     // ... filter to delete one Execution
     *   }
     * })
     * 
     */
    delete<T extends ExecutionDeleteArgs>(args: SelectSubset<T, ExecutionDeleteArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Execution.
     * @param {ExecutionUpdateArgs} args - Arguments to update one Execution.
     * @example
     * // Update one Execution
     * const execution = await prisma.execution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExecutionUpdateArgs>(args: SelectSubset<T, ExecutionUpdateArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Executions.
     * @param {ExecutionDeleteManyArgs} args - Arguments to filter Executions to delete.
     * @example
     * // Delete a few Executions
     * const { count } = await prisma.execution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExecutionDeleteManyArgs>(args?: SelectSubset<T, ExecutionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Executions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Executions
     * const execution = await prisma.execution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExecutionUpdateManyArgs>(args: SelectSubset<T, ExecutionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Executions and returns the data updated in the database.
     * @param {ExecutionUpdateManyAndReturnArgs} args - Arguments to update many Executions.
     * @example
     * // Update many Executions
     * const execution = await prisma.execution.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Executions and only return the `id`
     * const executionWithIdOnly = await prisma.execution.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExecutionUpdateManyAndReturnArgs>(args: SelectSubset<T, ExecutionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Execution.
     * @param {ExecutionUpsertArgs} args - Arguments to update or create a Execution.
     * @example
     * // Update or create a Execution
     * const execution = await prisma.execution.upsert({
     *   create: {
     *     // ... data to create a Execution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Execution we want to update
     *   }
     * })
     */
    upsert<T extends ExecutionUpsertArgs>(args: SelectSubset<T, ExecutionUpsertArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Executions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionCountArgs} args - Arguments to filter Executions to count.
     * @example
     * // Count the number of Executions
     * const count = await prisma.execution.count({
     *   where: {
     *     // ... the filter for the Executions we want to count
     *   }
     * })
    **/
    count<T extends ExecutionCountArgs>(
      args?: Subset<T, ExecutionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExecutionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Execution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExecutionAggregateArgs>(args: Subset<T, ExecutionAggregateArgs>): Prisma.PrismaPromise<GetExecutionAggregateType<T>>

    /**
     * Group by Execution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExecutionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExecutionGroupByArgs['orderBy'] }
        : { orderBy?: ExecutionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExecutionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExecutionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Execution model
   */
  readonly fields: ExecutionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Execution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExecutionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workflow<T extends WorkflowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowDefaultArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    triggeredByUser<T extends Execution$triggeredByUserArgs<ExtArgs> = {}>(args?: Subset<T, Execution$triggeredByUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    steps<T extends Execution$stepsArgs<ExtArgs> = {}>(args?: Subset<T, Execution$stepsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Execution model
   */
  interface ExecutionFieldRefs {
    readonly id: FieldRef<"Execution", 'String'>
    readonly workflowId: FieldRef<"Execution", 'String'>
    readonly triggerType: FieldRef<"Execution", 'ExecutionTriggerType'>
    readonly status: FieldRef<"Execution", 'ExecutionStatus'>
    readonly triggeredByUserId: FieldRef<"Execution", 'String'>
    readonly triggerPayload: FieldRef<"Execution", 'Json'>
    readonly state: FieldRef<"Execution", 'Json'>
    readonly workflowSnapshot: FieldRef<"Execution", 'Json'>
    readonly startedAt: FieldRef<"Execution", 'DateTime'>
    readonly completedAt: FieldRef<"Execution", 'DateTime'>
    readonly error: FieldRef<"Execution", 'Json'>
    readonly createdAt: FieldRef<"Execution", 'DateTime'>
    readonly updatedAt: FieldRef<"Execution", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Execution findUnique
   */
  export type ExecutionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Execution to fetch.
     */
    where: ExecutionWhereUniqueInput
  }

  /**
   * Execution findUniqueOrThrow
   */
  export type ExecutionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Execution to fetch.
     */
    where: ExecutionWhereUniqueInput
  }

  /**
   * Execution findFirst
   */
  export type ExecutionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Execution to fetch.
     */
    where?: ExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Executions to fetch.
     */
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Executions.
     */
    cursor?: ExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Executions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Executions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Executions.
     */
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * Execution findFirstOrThrow
   */
  export type ExecutionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Execution to fetch.
     */
    where?: ExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Executions to fetch.
     */
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Executions.
     */
    cursor?: ExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Executions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Executions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Executions.
     */
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * Execution findMany
   */
  export type ExecutionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Executions to fetch.
     */
    where?: ExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Executions to fetch.
     */
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Executions.
     */
    cursor?: ExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Executions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Executions.
     */
    skip?: number
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * Execution create
   */
  export type ExecutionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * The data needed to create a Execution.
     */
    data: XOR<ExecutionCreateInput, ExecutionUncheckedCreateInput>
  }

  /**
   * Execution createMany
   */
  export type ExecutionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Executions.
     */
    data: ExecutionCreateManyInput | ExecutionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Execution createManyAndReturn
   */
  export type ExecutionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * The data used to create many Executions.
     */
    data: ExecutionCreateManyInput | ExecutionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Execution update
   */
  export type ExecutionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * The data needed to update a Execution.
     */
    data: XOR<ExecutionUpdateInput, ExecutionUncheckedUpdateInput>
    /**
     * Choose, which Execution to update.
     */
    where: ExecutionWhereUniqueInput
  }

  /**
   * Execution updateMany
   */
  export type ExecutionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Executions.
     */
    data: XOR<ExecutionUpdateManyMutationInput, ExecutionUncheckedUpdateManyInput>
    /**
     * Filter which Executions to update
     */
    where?: ExecutionWhereInput
    /**
     * Limit how many Executions to update.
     */
    limit?: number
  }

  /**
   * Execution updateManyAndReturn
   */
  export type ExecutionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * The data used to update Executions.
     */
    data: XOR<ExecutionUpdateManyMutationInput, ExecutionUncheckedUpdateManyInput>
    /**
     * Filter which Executions to update
     */
    where?: ExecutionWhereInput
    /**
     * Limit how many Executions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Execution upsert
   */
  export type ExecutionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * The filter to search for the Execution to update in case it exists.
     */
    where: ExecutionWhereUniqueInput
    /**
     * In case the Execution found by the `where` argument doesn't exist, create a new Execution with this data.
     */
    create: XOR<ExecutionCreateInput, ExecutionUncheckedCreateInput>
    /**
     * In case the Execution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExecutionUpdateInput, ExecutionUncheckedUpdateInput>
  }

  /**
   * Execution delete
   */
  export type ExecutionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter which Execution to delete.
     */
    where: ExecutionWhereUniqueInput
  }

  /**
   * Execution deleteMany
   */
  export type ExecutionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Executions to delete
     */
    where?: ExecutionWhereInput
    /**
     * Limit how many Executions to delete.
     */
    limit?: number
  }

  /**
   * Execution.triggeredByUser
   */
  export type Execution$triggeredByUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Execution.steps
   */
  export type Execution$stepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    where?: ExecutionStepWhereInput
    orderBy?: ExecutionStepOrderByWithRelationInput | ExecutionStepOrderByWithRelationInput[]
    cursor?: ExecutionStepWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExecutionStepScalarFieldEnum | ExecutionStepScalarFieldEnum[]
  }

  /**
   * Execution without action
   */
  export type ExecutionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
  }


  /**
   * Model ExecutionStep
   */

  export type AggregateExecutionStep = {
    _count: ExecutionStepCountAggregateOutputType | null
    _avg: ExecutionStepAvgAggregateOutputType | null
    _sum: ExecutionStepSumAggregateOutputType | null
    _min: ExecutionStepMinAggregateOutputType | null
    _max: ExecutionStepMaxAggregateOutputType | null
  }

  export type ExecutionStepAvgAggregateOutputType = {
    position: number | null
    attempt: number | null
    durationMs: number | null
  }

  export type ExecutionStepSumAggregateOutputType = {
    position: number | null
    attempt: number | null
    durationMs: number | null
  }

  export type ExecutionStepMinAggregateOutputType = {
    id: string | null
    executionId: string | null
    nodeId: string | null
    nodeName: string | null
    nodeType: $Enums.NodeType | null
    status: $Enums.ExecutionStepStatus | null
    position: number | null
    attempt: number | null
    startedAt: Date | null
    completedAt: Date | null
    durationMs: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExecutionStepMaxAggregateOutputType = {
    id: string | null
    executionId: string | null
    nodeId: string | null
    nodeName: string | null
    nodeType: $Enums.NodeType | null
    status: $Enums.ExecutionStepStatus | null
    position: number | null
    attempt: number | null
    startedAt: Date | null
    completedAt: Date | null
    durationMs: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExecutionStepCountAggregateOutputType = {
    id: number
    executionId: number
    nodeId: number
    nodeName: number
    nodeType: number
    status: number
    position: number
    attempt: number
    input: number
    output: number
    error: number
    startedAt: number
    completedAt: number
    durationMs: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExecutionStepAvgAggregateInputType = {
    position?: true
    attempt?: true
    durationMs?: true
  }

  export type ExecutionStepSumAggregateInputType = {
    position?: true
    attempt?: true
    durationMs?: true
  }

  export type ExecutionStepMinAggregateInputType = {
    id?: true
    executionId?: true
    nodeId?: true
    nodeName?: true
    nodeType?: true
    status?: true
    position?: true
    attempt?: true
    startedAt?: true
    completedAt?: true
    durationMs?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExecutionStepMaxAggregateInputType = {
    id?: true
    executionId?: true
    nodeId?: true
    nodeName?: true
    nodeType?: true
    status?: true
    position?: true
    attempt?: true
    startedAt?: true
    completedAt?: true
    durationMs?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExecutionStepCountAggregateInputType = {
    id?: true
    executionId?: true
    nodeId?: true
    nodeName?: true
    nodeType?: true
    status?: true
    position?: true
    attempt?: true
    input?: true
    output?: true
    error?: true
    startedAt?: true
    completedAt?: true
    durationMs?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExecutionStepAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExecutionStep to aggregate.
     */
    where?: ExecutionStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExecutionSteps to fetch.
     */
    orderBy?: ExecutionStepOrderByWithRelationInput | ExecutionStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExecutionStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExecutionSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExecutionSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExecutionSteps
    **/
    _count?: true | ExecutionStepCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExecutionStepAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExecutionStepSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExecutionStepMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExecutionStepMaxAggregateInputType
  }

  export type GetExecutionStepAggregateType<T extends ExecutionStepAggregateArgs> = {
        [P in keyof T & keyof AggregateExecutionStep]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExecutionStep[P]>
      : GetScalarType<T[P], AggregateExecutionStep[P]>
  }




  export type ExecutionStepGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionStepWhereInput
    orderBy?: ExecutionStepOrderByWithAggregationInput | ExecutionStepOrderByWithAggregationInput[]
    by: ExecutionStepScalarFieldEnum[] | ExecutionStepScalarFieldEnum
    having?: ExecutionStepScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExecutionStepCountAggregateInputType | true
    _avg?: ExecutionStepAvgAggregateInputType
    _sum?: ExecutionStepSumAggregateInputType
    _min?: ExecutionStepMinAggregateInputType
    _max?: ExecutionStepMaxAggregateInputType
  }

  export type ExecutionStepGroupByOutputType = {
    id: string
    executionId: string
    nodeId: string | null
    nodeName: string
    nodeType: $Enums.NodeType
    status: $Enums.ExecutionStepStatus
    position: number
    attempt: number
    input: JsonValue
    output: JsonValue | null
    error: JsonValue | null
    startedAt: Date | null
    completedAt: Date | null
    durationMs: number | null
    createdAt: Date
    updatedAt: Date
    _count: ExecutionStepCountAggregateOutputType | null
    _avg: ExecutionStepAvgAggregateOutputType | null
    _sum: ExecutionStepSumAggregateOutputType | null
    _min: ExecutionStepMinAggregateOutputType | null
    _max: ExecutionStepMaxAggregateOutputType | null
  }

  type GetExecutionStepGroupByPayload<T extends ExecutionStepGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExecutionStepGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExecutionStepGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExecutionStepGroupByOutputType[P]>
            : GetScalarType<T[P], ExecutionStepGroupByOutputType[P]>
        }
      >
    >


  export type ExecutionStepSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    executionId?: boolean
    nodeId?: boolean
    nodeName?: boolean
    nodeType?: boolean
    status?: boolean
    position?: boolean
    attempt?: boolean
    input?: boolean
    output?: boolean
    error?: boolean
    startedAt?: boolean
    completedAt?: boolean
    durationMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    execution?: boolean | ExecutionDefaultArgs<ExtArgs>
    node?: boolean | ExecutionStep$nodeArgs<ExtArgs>
  }, ExtArgs["result"]["executionStep"]>

  export type ExecutionStepSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    executionId?: boolean
    nodeId?: boolean
    nodeName?: boolean
    nodeType?: boolean
    status?: boolean
    position?: boolean
    attempt?: boolean
    input?: boolean
    output?: boolean
    error?: boolean
    startedAt?: boolean
    completedAt?: boolean
    durationMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    execution?: boolean | ExecutionDefaultArgs<ExtArgs>
    node?: boolean | ExecutionStep$nodeArgs<ExtArgs>
  }, ExtArgs["result"]["executionStep"]>

  export type ExecutionStepSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    executionId?: boolean
    nodeId?: boolean
    nodeName?: boolean
    nodeType?: boolean
    status?: boolean
    position?: boolean
    attempt?: boolean
    input?: boolean
    output?: boolean
    error?: boolean
    startedAt?: boolean
    completedAt?: boolean
    durationMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    execution?: boolean | ExecutionDefaultArgs<ExtArgs>
    node?: boolean | ExecutionStep$nodeArgs<ExtArgs>
  }, ExtArgs["result"]["executionStep"]>

  export type ExecutionStepSelectScalar = {
    id?: boolean
    executionId?: boolean
    nodeId?: boolean
    nodeName?: boolean
    nodeType?: boolean
    status?: boolean
    position?: boolean
    attempt?: boolean
    input?: boolean
    output?: boolean
    error?: boolean
    startedAt?: boolean
    completedAt?: boolean
    durationMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExecutionStepOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "executionId" | "nodeId" | "nodeName" | "nodeType" | "status" | "position" | "attempt" | "input" | "output" | "error" | "startedAt" | "completedAt" | "durationMs" | "createdAt" | "updatedAt", ExtArgs["result"]["executionStep"]>
  export type ExecutionStepInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    execution?: boolean | ExecutionDefaultArgs<ExtArgs>
    node?: boolean | ExecutionStep$nodeArgs<ExtArgs>
  }
  export type ExecutionStepIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    execution?: boolean | ExecutionDefaultArgs<ExtArgs>
    node?: boolean | ExecutionStep$nodeArgs<ExtArgs>
  }
  export type ExecutionStepIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    execution?: boolean | ExecutionDefaultArgs<ExtArgs>
    node?: boolean | ExecutionStep$nodeArgs<ExtArgs>
  }

  export type $ExecutionStepPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExecutionStep"
    objects: {
      execution: Prisma.$ExecutionPayload<ExtArgs>
      node: Prisma.$NodePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      executionId: string
      nodeId: string | null
      nodeName: string
      nodeType: $Enums.NodeType
      status: $Enums.ExecutionStepStatus
      position: number
      attempt: number
      input: Prisma.JsonValue
      output: Prisma.JsonValue | null
      error: Prisma.JsonValue | null
      startedAt: Date | null
      completedAt: Date | null
      durationMs: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["executionStep"]>
    composites: {}
  }

  type ExecutionStepGetPayload<S extends boolean | null | undefined | ExecutionStepDefaultArgs> = $Result.GetResult<Prisma.$ExecutionStepPayload, S>

  type ExecutionStepCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExecutionStepFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExecutionStepCountAggregateInputType | true
    }

  export interface ExecutionStepDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExecutionStep'], meta: { name: 'ExecutionStep' } }
    /**
     * Find zero or one ExecutionStep that matches the filter.
     * @param {ExecutionStepFindUniqueArgs} args - Arguments to find a ExecutionStep
     * @example
     * // Get one ExecutionStep
     * const executionStep = await prisma.executionStep.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExecutionStepFindUniqueArgs>(args: SelectSubset<T, ExecutionStepFindUniqueArgs<ExtArgs>>): Prisma__ExecutionStepClient<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExecutionStep that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExecutionStepFindUniqueOrThrowArgs} args - Arguments to find a ExecutionStep
     * @example
     * // Get one ExecutionStep
     * const executionStep = await prisma.executionStep.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExecutionStepFindUniqueOrThrowArgs>(args: SelectSubset<T, ExecutionStepFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExecutionStepClient<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExecutionStep that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionStepFindFirstArgs} args - Arguments to find a ExecutionStep
     * @example
     * // Get one ExecutionStep
     * const executionStep = await prisma.executionStep.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExecutionStepFindFirstArgs>(args?: SelectSubset<T, ExecutionStepFindFirstArgs<ExtArgs>>): Prisma__ExecutionStepClient<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExecutionStep that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionStepFindFirstOrThrowArgs} args - Arguments to find a ExecutionStep
     * @example
     * // Get one ExecutionStep
     * const executionStep = await prisma.executionStep.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExecutionStepFindFirstOrThrowArgs>(args?: SelectSubset<T, ExecutionStepFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExecutionStepClient<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExecutionSteps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionStepFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExecutionSteps
     * const executionSteps = await prisma.executionStep.findMany()
     * 
     * // Get first 10 ExecutionSteps
     * const executionSteps = await prisma.executionStep.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const executionStepWithIdOnly = await prisma.executionStep.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExecutionStepFindManyArgs>(args?: SelectSubset<T, ExecutionStepFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExecutionStep.
     * @param {ExecutionStepCreateArgs} args - Arguments to create a ExecutionStep.
     * @example
     * // Create one ExecutionStep
     * const ExecutionStep = await prisma.executionStep.create({
     *   data: {
     *     // ... data to create a ExecutionStep
     *   }
     * })
     * 
     */
    create<T extends ExecutionStepCreateArgs>(args: SelectSubset<T, ExecutionStepCreateArgs<ExtArgs>>): Prisma__ExecutionStepClient<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExecutionSteps.
     * @param {ExecutionStepCreateManyArgs} args - Arguments to create many ExecutionSteps.
     * @example
     * // Create many ExecutionSteps
     * const executionStep = await prisma.executionStep.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExecutionStepCreateManyArgs>(args?: SelectSubset<T, ExecutionStepCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExecutionSteps and returns the data saved in the database.
     * @param {ExecutionStepCreateManyAndReturnArgs} args - Arguments to create many ExecutionSteps.
     * @example
     * // Create many ExecutionSteps
     * const executionStep = await prisma.executionStep.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExecutionSteps and only return the `id`
     * const executionStepWithIdOnly = await prisma.executionStep.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExecutionStepCreateManyAndReturnArgs>(args?: SelectSubset<T, ExecutionStepCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExecutionStep.
     * @param {ExecutionStepDeleteArgs} args - Arguments to delete one ExecutionStep.
     * @example
     * // Delete one ExecutionStep
     * const ExecutionStep = await prisma.executionStep.delete({
     *   where: {
     *     // ... filter to delete one ExecutionStep
     *   }
     * })
     * 
     */
    delete<T extends ExecutionStepDeleteArgs>(args: SelectSubset<T, ExecutionStepDeleteArgs<ExtArgs>>): Prisma__ExecutionStepClient<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExecutionStep.
     * @param {ExecutionStepUpdateArgs} args - Arguments to update one ExecutionStep.
     * @example
     * // Update one ExecutionStep
     * const executionStep = await prisma.executionStep.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExecutionStepUpdateArgs>(args: SelectSubset<T, ExecutionStepUpdateArgs<ExtArgs>>): Prisma__ExecutionStepClient<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExecutionSteps.
     * @param {ExecutionStepDeleteManyArgs} args - Arguments to filter ExecutionSteps to delete.
     * @example
     * // Delete a few ExecutionSteps
     * const { count } = await prisma.executionStep.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExecutionStepDeleteManyArgs>(args?: SelectSubset<T, ExecutionStepDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExecutionSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionStepUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExecutionSteps
     * const executionStep = await prisma.executionStep.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExecutionStepUpdateManyArgs>(args: SelectSubset<T, ExecutionStepUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExecutionSteps and returns the data updated in the database.
     * @param {ExecutionStepUpdateManyAndReturnArgs} args - Arguments to update many ExecutionSteps.
     * @example
     * // Update many ExecutionSteps
     * const executionStep = await prisma.executionStep.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExecutionSteps and only return the `id`
     * const executionStepWithIdOnly = await prisma.executionStep.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExecutionStepUpdateManyAndReturnArgs>(args: SelectSubset<T, ExecutionStepUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExecutionStep.
     * @param {ExecutionStepUpsertArgs} args - Arguments to update or create a ExecutionStep.
     * @example
     * // Update or create a ExecutionStep
     * const executionStep = await prisma.executionStep.upsert({
     *   create: {
     *     // ... data to create a ExecutionStep
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExecutionStep we want to update
     *   }
     * })
     */
    upsert<T extends ExecutionStepUpsertArgs>(args: SelectSubset<T, ExecutionStepUpsertArgs<ExtArgs>>): Prisma__ExecutionStepClient<$Result.GetResult<Prisma.$ExecutionStepPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExecutionSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionStepCountArgs} args - Arguments to filter ExecutionSteps to count.
     * @example
     * // Count the number of ExecutionSteps
     * const count = await prisma.executionStep.count({
     *   where: {
     *     // ... the filter for the ExecutionSteps we want to count
     *   }
     * })
    **/
    count<T extends ExecutionStepCountArgs>(
      args?: Subset<T, ExecutionStepCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExecutionStepCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExecutionStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionStepAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExecutionStepAggregateArgs>(args: Subset<T, ExecutionStepAggregateArgs>): Prisma.PrismaPromise<GetExecutionStepAggregateType<T>>

    /**
     * Group by ExecutionStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionStepGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExecutionStepGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExecutionStepGroupByArgs['orderBy'] }
        : { orderBy?: ExecutionStepGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExecutionStepGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExecutionStepGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExecutionStep model
   */
  readonly fields: ExecutionStepFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExecutionStep.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExecutionStepClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    execution<T extends ExecutionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExecutionDefaultArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    node<T extends ExecutionStep$nodeArgs<ExtArgs> = {}>(args?: Subset<T, ExecutionStep$nodeArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExecutionStep model
   */
  interface ExecutionStepFieldRefs {
    readonly id: FieldRef<"ExecutionStep", 'String'>
    readonly executionId: FieldRef<"ExecutionStep", 'String'>
    readonly nodeId: FieldRef<"ExecutionStep", 'String'>
    readonly nodeName: FieldRef<"ExecutionStep", 'String'>
    readonly nodeType: FieldRef<"ExecutionStep", 'NodeType'>
    readonly status: FieldRef<"ExecutionStep", 'ExecutionStepStatus'>
    readonly position: FieldRef<"ExecutionStep", 'Int'>
    readonly attempt: FieldRef<"ExecutionStep", 'Int'>
    readonly input: FieldRef<"ExecutionStep", 'Json'>
    readonly output: FieldRef<"ExecutionStep", 'Json'>
    readonly error: FieldRef<"ExecutionStep", 'Json'>
    readonly startedAt: FieldRef<"ExecutionStep", 'DateTime'>
    readonly completedAt: FieldRef<"ExecutionStep", 'DateTime'>
    readonly durationMs: FieldRef<"ExecutionStep", 'Int'>
    readonly createdAt: FieldRef<"ExecutionStep", 'DateTime'>
    readonly updatedAt: FieldRef<"ExecutionStep", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExecutionStep findUnique
   */
  export type ExecutionStepFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionStep to fetch.
     */
    where: ExecutionStepWhereUniqueInput
  }

  /**
   * ExecutionStep findUniqueOrThrow
   */
  export type ExecutionStepFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionStep to fetch.
     */
    where: ExecutionStepWhereUniqueInput
  }

  /**
   * ExecutionStep findFirst
   */
  export type ExecutionStepFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionStep to fetch.
     */
    where?: ExecutionStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExecutionSteps to fetch.
     */
    orderBy?: ExecutionStepOrderByWithRelationInput | ExecutionStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExecutionSteps.
     */
    cursor?: ExecutionStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExecutionSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExecutionSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExecutionSteps.
     */
    distinct?: ExecutionStepScalarFieldEnum | ExecutionStepScalarFieldEnum[]
  }

  /**
   * ExecutionStep findFirstOrThrow
   */
  export type ExecutionStepFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionStep to fetch.
     */
    where?: ExecutionStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExecutionSteps to fetch.
     */
    orderBy?: ExecutionStepOrderByWithRelationInput | ExecutionStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExecutionSteps.
     */
    cursor?: ExecutionStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExecutionSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExecutionSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExecutionSteps.
     */
    distinct?: ExecutionStepScalarFieldEnum | ExecutionStepScalarFieldEnum[]
  }

  /**
   * ExecutionStep findMany
   */
  export type ExecutionStepFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionSteps to fetch.
     */
    where?: ExecutionStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExecutionSteps to fetch.
     */
    orderBy?: ExecutionStepOrderByWithRelationInput | ExecutionStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExecutionSteps.
     */
    cursor?: ExecutionStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExecutionSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExecutionSteps.
     */
    skip?: number
    distinct?: ExecutionStepScalarFieldEnum | ExecutionStepScalarFieldEnum[]
  }

  /**
   * ExecutionStep create
   */
  export type ExecutionStepCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * The data needed to create a ExecutionStep.
     */
    data: XOR<ExecutionStepCreateInput, ExecutionStepUncheckedCreateInput>
  }

  /**
   * ExecutionStep createMany
   */
  export type ExecutionStepCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExecutionSteps.
     */
    data: ExecutionStepCreateManyInput | ExecutionStepCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExecutionStep createManyAndReturn
   */
  export type ExecutionStepCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * The data used to create many ExecutionSteps.
     */
    data: ExecutionStepCreateManyInput | ExecutionStepCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExecutionStep update
   */
  export type ExecutionStepUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * The data needed to update a ExecutionStep.
     */
    data: XOR<ExecutionStepUpdateInput, ExecutionStepUncheckedUpdateInput>
    /**
     * Choose, which ExecutionStep to update.
     */
    where: ExecutionStepWhereUniqueInput
  }

  /**
   * ExecutionStep updateMany
   */
  export type ExecutionStepUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExecutionSteps.
     */
    data: XOR<ExecutionStepUpdateManyMutationInput, ExecutionStepUncheckedUpdateManyInput>
    /**
     * Filter which ExecutionSteps to update
     */
    where?: ExecutionStepWhereInput
    /**
     * Limit how many ExecutionSteps to update.
     */
    limit?: number
  }

  /**
   * ExecutionStep updateManyAndReturn
   */
  export type ExecutionStepUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * The data used to update ExecutionSteps.
     */
    data: XOR<ExecutionStepUpdateManyMutationInput, ExecutionStepUncheckedUpdateManyInput>
    /**
     * Filter which ExecutionSteps to update
     */
    where?: ExecutionStepWhereInput
    /**
     * Limit how many ExecutionSteps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExecutionStep upsert
   */
  export type ExecutionStepUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * The filter to search for the ExecutionStep to update in case it exists.
     */
    where: ExecutionStepWhereUniqueInput
    /**
     * In case the ExecutionStep found by the `where` argument doesn't exist, create a new ExecutionStep with this data.
     */
    create: XOR<ExecutionStepCreateInput, ExecutionStepUncheckedCreateInput>
    /**
     * In case the ExecutionStep was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExecutionStepUpdateInput, ExecutionStepUncheckedUpdateInput>
  }

  /**
   * ExecutionStep delete
   */
  export type ExecutionStepDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
    /**
     * Filter which ExecutionStep to delete.
     */
    where: ExecutionStepWhereUniqueInput
  }

  /**
   * ExecutionStep deleteMany
   */
  export type ExecutionStepDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExecutionSteps to delete
     */
    where?: ExecutionStepWhereInput
    /**
     * Limit how many ExecutionSteps to delete.
     */
    limit?: number
  }

  /**
   * ExecutionStep.node
   */
  export type ExecutionStep$nodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    where?: NodeWhereInput
  }

  /**
   * ExecutionStep without action
   */
  export type ExecutionStepDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionStep
     */
    select?: ExecutionStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExecutionStep
     */
    omit?: ExecutionStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionStepInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const WorkflowScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type WorkflowScalarFieldEnum = (typeof WorkflowScalarFieldEnum)[keyof typeof WorkflowScalarFieldEnum]


  export const NodeScalarFieldEnum: {
    id: 'id',
    workflowId: 'workflowId',
    name: 'name',
    type: 'type',
    position: 'position',
    data: 'data',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NodeScalarFieldEnum = (typeof NodeScalarFieldEnum)[keyof typeof NodeScalarFieldEnum]


  export const ConnectionScalarFieldEnum: {
    id: 'id',
    workflowId: 'workflowId',
    fromNodeId: 'fromNodeId',
    fromOutput: 'fromOutput',
    toNodeId: 'toNodeId',
    toInput: 'toInput',
    data: 'data',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConnectionScalarFieldEnum = (typeof ConnectionScalarFieldEnum)[keyof typeof ConnectionScalarFieldEnum]


  export const CredentialScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    provider: 'provider',
    description: 'description',
    encryptedData: 'encryptedData',
    metadata: 'metadata',
    lastUsedAt: 'lastUsedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CredentialScalarFieldEnum = (typeof CredentialScalarFieldEnum)[keyof typeof CredentialScalarFieldEnum]


  export const ExecutionScalarFieldEnum: {
    id: 'id',
    workflowId: 'workflowId',
    triggerType: 'triggerType',
    status: 'status',
    triggeredByUserId: 'triggeredByUserId',
    triggerPayload: 'triggerPayload',
    state: 'state',
    workflowSnapshot: 'workflowSnapshot',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    error: 'error',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExecutionScalarFieldEnum = (typeof ExecutionScalarFieldEnum)[keyof typeof ExecutionScalarFieldEnum]


  export const ExecutionStepScalarFieldEnum: {
    id: 'id',
    executionId: 'executionId',
    nodeId: 'nodeId',
    nodeName: 'nodeName',
    nodeType: 'nodeType',
    status: 'status',
    position: 'position',
    attempt: 'attempt',
    input: 'input',
    output: 'output',
    error: 'error',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    durationMs: 'durationMs',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExecutionStepScalarFieldEnum = (typeof ExecutionStepScalarFieldEnum)[keyof typeof ExecutionStepScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'NodeType'
   */
  export type EnumNodeTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NodeType'>
    


  /**
   * Reference to a field of type 'NodeType[]'
   */
  export type ListEnumNodeTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NodeType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'CredentialProvider'
   */
  export type EnumCredentialProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CredentialProvider'>
    


  /**
   * Reference to a field of type 'CredentialProvider[]'
   */
  export type ListEnumCredentialProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CredentialProvider[]'>
    


  /**
   * Reference to a field of type 'ExecutionTriggerType'
   */
  export type EnumExecutionTriggerTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExecutionTriggerType'>
    


  /**
   * Reference to a field of type 'ExecutionTriggerType[]'
   */
  export type ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExecutionTriggerType[]'>
    


  /**
   * Reference to a field of type 'ExecutionStatus'
   */
  export type EnumExecutionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExecutionStatus'>
    


  /**
   * Reference to a field of type 'ExecutionStatus[]'
   */
  export type ListEnumExecutionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExecutionStatus[]'>
    


  /**
   * Reference to a field of type 'ExecutionStepStatus'
   */
  export type EnumExecutionStepStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExecutionStepStatus'>
    


  /**
   * Reference to a field of type 'ExecutionStepStatus[]'
   */
  export type ListEnumExecutionStepStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExecutionStepStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    workflows?: WorkflowListRelationFilter
    credentials?: CredentialListRelationFilter
    executions?: ExecutionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    workflows?: WorkflowOrderByRelationAggregateInput
    credentials?: CredentialOrderByRelationAggregateInput
    executions?: ExecutionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    workflows?: WorkflowListRelationFilter
    credentials?: CredentialListRelationFilter
    executions?: ExecutionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }, "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
  }

  export type WorkflowWhereInput = {
    AND?: WorkflowWhereInput | WorkflowWhereInput[]
    OR?: WorkflowWhereInput[]
    NOT?: WorkflowWhereInput | WorkflowWhereInput[]
    id?: StringFilter<"Workflow"> | string
    name?: StringFilter<"Workflow"> | string
    createdAt?: DateTimeFilter<"Workflow"> | Date | string
    updatedAt?: DateTimeFilter<"Workflow"> | Date | string
    userId?: StringFilter<"Workflow"> | string
    nodes?: NodeListRelationFilter
    connections?: ConnectionListRelationFilter
    executions?: ExecutionListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type WorkflowOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    nodes?: NodeOrderByRelationAggregateInput
    connections?: ConnectionOrderByRelationAggregateInput
    executions?: ExecutionOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type WorkflowWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkflowWhereInput | WorkflowWhereInput[]
    OR?: WorkflowWhereInput[]
    NOT?: WorkflowWhereInput | WorkflowWhereInput[]
    name?: StringFilter<"Workflow"> | string
    createdAt?: DateTimeFilter<"Workflow"> | Date | string
    updatedAt?: DateTimeFilter<"Workflow"> | Date | string
    userId?: StringFilter<"Workflow"> | string
    nodes?: NodeListRelationFilter
    connections?: ConnectionListRelationFilter
    executions?: ExecutionListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type WorkflowOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    _count?: WorkflowCountOrderByAggregateInput
    _max?: WorkflowMaxOrderByAggregateInput
    _min?: WorkflowMinOrderByAggregateInput
  }

  export type WorkflowScalarWhereWithAggregatesInput = {
    AND?: WorkflowScalarWhereWithAggregatesInput | WorkflowScalarWhereWithAggregatesInput[]
    OR?: WorkflowScalarWhereWithAggregatesInput[]
    NOT?: WorkflowScalarWhereWithAggregatesInput | WorkflowScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workflow"> | string
    name?: StringWithAggregatesFilter<"Workflow"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Workflow"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Workflow"> | Date | string
    userId?: StringWithAggregatesFilter<"Workflow"> | string
  }

  export type NodeWhereInput = {
    AND?: NodeWhereInput | NodeWhereInput[]
    OR?: NodeWhereInput[]
    NOT?: NodeWhereInput | NodeWhereInput[]
    id?: StringFilter<"Node"> | string
    workflowId?: StringFilter<"Node"> | string
    name?: StringFilter<"Node"> | string
    type?: EnumNodeTypeFilter<"Node"> | $Enums.NodeType
    position?: JsonFilter<"Node">
    data?: JsonFilter<"Node">
    createdAt?: DateTimeFilter<"Node"> | Date | string
    updatedAt?: DateTimeFilter<"Node"> | Date | string
    workflow?: XOR<WorkflowScalarRelationFilter, WorkflowWhereInput>
    fromConnections?: ConnectionListRelationFilter
    toConnections?: ConnectionListRelationFilter
    executionSteps?: ExecutionStepListRelationFilter
  }

  export type NodeOrderByWithRelationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    position?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workflow?: WorkflowOrderByWithRelationInput
    fromConnections?: ConnectionOrderByRelationAggregateInput
    toConnections?: ConnectionOrderByRelationAggregateInput
    executionSteps?: ExecutionStepOrderByRelationAggregateInput
  }

  export type NodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NodeWhereInput | NodeWhereInput[]
    OR?: NodeWhereInput[]
    NOT?: NodeWhereInput | NodeWhereInput[]
    workflowId?: StringFilter<"Node"> | string
    name?: StringFilter<"Node"> | string
    type?: EnumNodeTypeFilter<"Node"> | $Enums.NodeType
    position?: JsonFilter<"Node">
    data?: JsonFilter<"Node">
    createdAt?: DateTimeFilter<"Node"> | Date | string
    updatedAt?: DateTimeFilter<"Node"> | Date | string
    workflow?: XOR<WorkflowScalarRelationFilter, WorkflowWhereInput>
    fromConnections?: ConnectionListRelationFilter
    toConnections?: ConnectionListRelationFilter
    executionSteps?: ExecutionStepListRelationFilter
  }, "id">

  export type NodeOrderByWithAggregationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    position?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NodeCountOrderByAggregateInput
    _max?: NodeMaxOrderByAggregateInput
    _min?: NodeMinOrderByAggregateInput
  }

  export type NodeScalarWhereWithAggregatesInput = {
    AND?: NodeScalarWhereWithAggregatesInput | NodeScalarWhereWithAggregatesInput[]
    OR?: NodeScalarWhereWithAggregatesInput[]
    NOT?: NodeScalarWhereWithAggregatesInput | NodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Node"> | string
    workflowId?: StringWithAggregatesFilter<"Node"> | string
    name?: StringWithAggregatesFilter<"Node"> | string
    type?: EnumNodeTypeWithAggregatesFilter<"Node"> | $Enums.NodeType
    position?: JsonWithAggregatesFilter<"Node">
    data?: JsonWithAggregatesFilter<"Node">
    createdAt?: DateTimeWithAggregatesFilter<"Node"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Node"> | Date | string
  }

  export type ConnectionWhereInput = {
    AND?: ConnectionWhereInput | ConnectionWhereInput[]
    OR?: ConnectionWhereInput[]
    NOT?: ConnectionWhereInput | ConnectionWhereInput[]
    id?: StringFilter<"Connection"> | string
    workflowId?: StringFilter<"Connection"> | string
    fromNodeId?: StringFilter<"Connection"> | string
    fromOutput?: StringFilter<"Connection"> | string
    toNodeId?: StringFilter<"Connection"> | string
    toInput?: StringFilter<"Connection"> | string
    data?: JsonFilter<"Connection">
    createdAt?: DateTimeFilter<"Connection"> | Date | string
    updatedAt?: DateTimeFilter<"Connection"> | Date | string
    workflow?: XOR<WorkflowScalarRelationFilter, WorkflowWhereInput>
    fromNode?: XOR<NodeScalarRelationFilter, NodeWhereInput>
    toNode?: XOR<NodeScalarRelationFilter, NodeWhereInput>
  }

  export type ConnectionOrderByWithRelationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    fromNodeId?: SortOrder
    fromOutput?: SortOrder
    toNodeId?: SortOrder
    toInput?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workflow?: WorkflowOrderByWithRelationInput
    fromNode?: NodeOrderByWithRelationInput
    toNode?: NodeOrderByWithRelationInput
  }

  export type ConnectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    fromNodeId_toNodeId_fromOutput_toInput?: ConnectionFromNodeIdToNodeIdFromOutputToInputCompoundUniqueInput
    AND?: ConnectionWhereInput | ConnectionWhereInput[]
    OR?: ConnectionWhereInput[]
    NOT?: ConnectionWhereInput | ConnectionWhereInput[]
    workflowId?: StringFilter<"Connection"> | string
    fromNodeId?: StringFilter<"Connection"> | string
    fromOutput?: StringFilter<"Connection"> | string
    toNodeId?: StringFilter<"Connection"> | string
    toInput?: StringFilter<"Connection"> | string
    data?: JsonFilter<"Connection">
    createdAt?: DateTimeFilter<"Connection"> | Date | string
    updatedAt?: DateTimeFilter<"Connection"> | Date | string
    workflow?: XOR<WorkflowScalarRelationFilter, WorkflowWhereInput>
    fromNode?: XOR<NodeScalarRelationFilter, NodeWhereInput>
    toNode?: XOR<NodeScalarRelationFilter, NodeWhereInput>
  }, "id" | "fromNodeId_toNodeId_fromOutput_toInput">

  export type ConnectionOrderByWithAggregationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    fromNodeId?: SortOrder
    fromOutput?: SortOrder
    toNodeId?: SortOrder
    toInput?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConnectionCountOrderByAggregateInput
    _max?: ConnectionMaxOrderByAggregateInput
    _min?: ConnectionMinOrderByAggregateInput
  }

  export type ConnectionScalarWhereWithAggregatesInput = {
    AND?: ConnectionScalarWhereWithAggregatesInput | ConnectionScalarWhereWithAggregatesInput[]
    OR?: ConnectionScalarWhereWithAggregatesInput[]
    NOT?: ConnectionScalarWhereWithAggregatesInput | ConnectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Connection"> | string
    workflowId?: StringWithAggregatesFilter<"Connection"> | string
    fromNodeId?: StringWithAggregatesFilter<"Connection"> | string
    fromOutput?: StringWithAggregatesFilter<"Connection"> | string
    toNodeId?: StringWithAggregatesFilter<"Connection"> | string
    toInput?: StringWithAggregatesFilter<"Connection"> | string
    data?: JsonWithAggregatesFilter<"Connection">
    createdAt?: DateTimeWithAggregatesFilter<"Connection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Connection"> | Date | string
  }

  export type CredentialWhereInput = {
    AND?: CredentialWhereInput | CredentialWhereInput[]
    OR?: CredentialWhereInput[]
    NOT?: CredentialWhereInput | CredentialWhereInput[]
    id?: StringFilter<"Credential"> | string
    userId?: StringFilter<"Credential"> | string
    name?: StringFilter<"Credential"> | string
    provider?: EnumCredentialProviderFilter<"Credential"> | $Enums.CredentialProvider
    description?: StringNullableFilter<"Credential"> | string | null
    encryptedData?: StringFilter<"Credential"> | string
    metadata?: JsonFilter<"Credential">
    lastUsedAt?: DateTimeNullableFilter<"Credential"> | Date | string | null
    createdAt?: DateTimeFilter<"Credential"> | Date | string
    updatedAt?: DateTimeFilter<"Credential"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CredentialOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    description?: SortOrderInput | SortOrder
    encryptedData?: SortOrder
    metadata?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type CredentialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_name?: CredentialUserIdNameCompoundUniqueInput
    AND?: CredentialWhereInput | CredentialWhereInput[]
    OR?: CredentialWhereInput[]
    NOT?: CredentialWhereInput | CredentialWhereInput[]
    userId?: StringFilter<"Credential"> | string
    name?: StringFilter<"Credential"> | string
    provider?: EnumCredentialProviderFilter<"Credential"> | $Enums.CredentialProvider
    description?: StringNullableFilter<"Credential"> | string | null
    encryptedData?: StringFilter<"Credential"> | string
    metadata?: JsonFilter<"Credential">
    lastUsedAt?: DateTimeNullableFilter<"Credential"> | Date | string | null
    createdAt?: DateTimeFilter<"Credential"> | Date | string
    updatedAt?: DateTimeFilter<"Credential"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_name">

  export type CredentialOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    description?: SortOrderInput | SortOrder
    encryptedData?: SortOrder
    metadata?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CredentialCountOrderByAggregateInput
    _max?: CredentialMaxOrderByAggregateInput
    _min?: CredentialMinOrderByAggregateInput
  }

  export type CredentialScalarWhereWithAggregatesInput = {
    AND?: CredentialScalarWhereWithAggregatesInput | CredentialScalarWhereWithAggregatesInput[]
    OR?: CredentialScalarWhereWithAggregatesInput[]
    NOT?: CredentialScalarWhereWithAggregatesInput | CredentialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Credential"> | string
    userId?: StringWithAggregatesFilter<"Credential"> | string
    name?: StringWithAggregatesFilter<"Credential"> | string
    provider?: EnumCredentialProviderWithAggregatesFilter<"Credential"> | $Enums.CredentialProvider
    description?: StringNullableWithAggregatesFilter<"Credential"> | string | null
    encryptedData?: StringWithAggregatesFilter<"Credential"> | string
    metadata?: JsonWithAggregatesFilter<"Credential">
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"Credential"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Credential"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Credential"> | Date | string
  }

  export type ExecutionWhereInput = {
    AND?: ExecutionWhereInput | ExecutionWhereInput[]
    OR?: ExecutionWhereInput[]
    NOT?: ExecutionWhereInput | ExecutionWhereInput[]
    id?: StringFilter<"Execution"> | string
    workflowId?: StringFilter<"Execution"> | string
    triggerType?: EnumExecutionTriggerTypeFilter<"Execution"> | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFilter<"Execution"> | $Enums.ExecutionStatus
    triggeredByUserId?: StringNullableFilter<"Execution"> | string | null
    triggerPayload?: JsonFilter<"Execution">
    state?: JsonFilter<"Execution">
    workflowSnapshot?: JsonNullableFilter<"Execution">
    startedAt?: DateTimeNullableFilter<"Execution"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Execution"> | Date | string | null
    error?: JsonNullableFilter<"Execution">
    createdAt?: DateTimeFilter<"Execution"> | Date | string
    updatedAt?: DateTimeFilter<"Execution"> | Date | string
    workflow?: XOR<WorkflowScalarRelationFilter, WorkflowWhereInput>
    triggeredByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    steps?: ExecutionStepListRelationFilter
  }

  export type ExecutionOrderByWithRelationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    triggerType?: SortOrder
    status?: SortOrder
    triggeredByUserId?: SortOrderInput | SortOrder
    triggerPayload?: SortOrder
    state?: SortOrder
    workflowSnapshot?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workflow?: WorkflowOrderByWithRelationInput
    triggeredByUser?: UserOrderByWithRelationInput
    steps?: ExecutionStepOrderByRelationAggregateInput
  }

  export type ExecutionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExecutionWhereInput | ExecutionWhereInput[]
    OR?: ExecutionWhereInput[]
    NOT?: ExecutionWhereInput | ExecutionWhereInput[]
    workflowId?: StringFilter<"Execution"> | string
    triggerType?: EnumExecutionTriggerTypeFilter<"Execution"> | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFilter<"Execution"> | $Enums.ExecutionStatus
    triggeredByUserId?: StringNullableFilter<"Execution"> | string | null
    triggerPayload?: JsonFilter<"Execution">
    state?: JsonFilter<"Execution">
    workflowSnapshot?: JsonNullableFilter<"Execution">
    startedAt?: DateTimeNullableFilter<"Execution"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Execution"> | Date | string | null
    error?: JsonNullableFilter<"Execution">
    createdAt?: DateTimeFilter<"Execution"> | Date | string
    updatedAt?: DateTimeFilter<"Execution"> | Date | string
    workflow?: XOR<WorkflowScalarRelationFilter, WorkflowWhereInput>
    triggeredByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    steps?: ExecutionStepListRelationFilter
  }, "id">

  export type ExecutionOrderByWithAggregationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    triggerType?: SortOrder
    status?: SortOrder
    triggeredByUserId?: SortOrderInput | SortOrder
    triggerPayload?: SortOrder
    state?: SortOrder
    workflowSnapshot?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExecutionCountOrderByAggregateInput
    _max?: ExecutionMaxOrderByAggregateInput
    _min?: ExecutionMinOrderByAggregateInput
  }

  export type ExecutionScalarWhereWithAggregatesInput = {
    AND?: ExecutionScalarWhereWithAggregatesInput | ExecutionScalarWhereWithAggregatesInput[]
    OR?: ExecutionScalarWhereWithAggregatesInput[]
    NOT?: ExecutionScalarWhereWithAggregatesInput | ExecutionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Execution"> | string
    workflowId?: StringWithAggregatesFilter<"Execution"> | string
    triggerType?: EnumExecutionTriggerTypeWithAggregatesFilter<"Execution"> | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusWithAggregatesFilter<"Execution"> | $Enums.ExecutionStatus
    triggeredByUserId?: StringNullableWithAggregatesFilter<"Execution"> | string | null
    triggerPayload?: JsonWithAggregatesFilter<"Execution">
    state?: JsonWithAggregatesFilter<"Execution">
    workflowSnapshot?: JsonNullableWithAggregatesFilter<"Execution">
    startedAt?: DateTimeNullableWithAggregatesFilter<"Execution"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"Execution"> | Date | string | null
    error?: JsonNullableWithAggregatesFilter<"Execution">
    createdAt?: DateTimeWithAggregatesFilter<"Execution"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Execution"> | Date | string
  }

  export type ExecutionStepWhereInput = {
    AND?: ExecutionStepWhereInput | ExecutionStepWhereInput[]
    OR?: ExecutionStepWhereInput[]
    NOT?: ExecutionStepWhereInput | ExecutionStepWhereInput[]
    id?: StringFilter<"ExecutionStep"> | string
    executionId?: StringFilter<"ExecutionStep"> | string
    nodeId?: StringNullableFilter<"ExecutionStep"> | string | null
    nodeName?: StringFilter<"ExecutionStep"> | string
    nodeType?: EnumNodeTypeFilter<"ExecutionStep"> | $Enums.NodeType
    status?: EnumExecutionStepStatusFilter<"ExecutionStep"> | $Enums.ExecutionStepStatus
    position?: IntFilter<"ExecutionStep"> | number
    attempt?: IntFilter<"ExecutionStep"> | number
    input?: JsonFilter<"ExecutionStep">
    output?: JsonNullableFilter<"ExecutionStep">
    error?: JsonNullableFilter<"ExecutionStep">
    startedAt?: DateTimeNullableFilter<"ExecutionStep"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ExecutionStep"> | Date | string | null
    durationMs?: IntNullableFilter<"ExecutionStep"> | number | null
    createdAt?: DateTimeFilter<"ExecutionStep"> | Date | string
    updatedAt?: DateTimeFilter<"ExecutionStep"> | Date | string
    execution?: XOR<ExecutionScalarRelationFilter, ExecutionWhereInput>
    node?: XOR<NodeNullableScalarRelationFilter, NodeWhereInput> | null
  }

  export type ExecutionStepOrderByWithRelationInput = {
    id?: SortOrder
    executionId?: SortOrder
    nodeId?: SortOrderInput | SortOrder
    nodeName?: SortOrder
    nodeType?: SortOrder
    status?: SortOrder
    position?: SortOrder
    attempt?: SortOrder
    input?: SortOrder
    output?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    execution?: ExecutionOrderByWithRelationInput
    node?: NodeOrderByWithRelationInput
  }

  export type ExecutionStepWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExecutionStepWhereInput | ExecutionStepWhereInput[]
    OR?: ExecutionStepWhereInput[]
    NOT?: ExecutionStepWhereInput | ExecutionStepWhereInput[]
    executionId?: StringFilter<"ExecutionStep"> | string
    nodeId?: StringNullableFilter<"ExecutionStep"> | string | null
    nodeName?: StringFilter<"ExecutionStep"> | string
    nodeType?: EnumNodeTypeFilter<"ExecutionStep"> | $Enums.NodeType
    status?: EnumExecutionStepStatusFilter<"ExecutionStep"> | $Enums.ExecutionStepStatus
    position?: IntFilter<"ExecutionStep"> | number
    attempt?: IntFilter<"ExecutionStep"> | number
    input?: JsonFilter<"ExecutionStep">
    output?: JsonNullableFilter<"ExecutionStep">
    error?: JsonNullableFilter<"ExecutionStep">
    startedAt?: DateTimeNullableFilter<"ExecutionStep"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ExecutionStep"> | Date | string | null
    durationMs?: IntNullableFilter<"ExecutionStep"> | number | null
    createdAt?: DateTimeFilter<"ExecutionStep"> | Date | string
    updatedAt?: DateTimeFilter<"ExecutionStep"> | Date | string
    execution?: XOR<ExecutionScalarRelationFilter, ExecutionWhereInput>
    node?: XOR<NodeNullableScalarRelationFilter, NodeWhereInput> | null
  }, "id">

  export type ExecutionStepOrderByWithAggregationInput = {
    id?: SortOrder
    executionId?: SortOrder
    nodeId?: SortOrderInput | SortOrder
    nodeName?: SortOrder
    nodeType?: SortOrder
    status?: SortOrder
    position?: SortOrder
    attempt?: SortOrder
    input?: SortOrder
    output?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExecutionStepCountOrderByAggregateInput
    _avg?: ExecutionStepAvgOrderByAggregateInput
    _max?: ExecutionStepMaxOrderByAggregateInput
    _min?: ExecutionStepMinOrderByAggregateInput
    _sum?: ExecutionStepSumOrderByAggregateInput
  }

  export type ExecutionStepScalarWhereWithAggregatesInput = {
    AND?: ExecutionStepScalarWhereWithAggregatesInput | ExecutionStepScalarWhereWithAggregatesInput[]
    OR?: ExecutionStepScalarWhereWithAggregatesInput[]
    NOT?: ExecutionStepScalarWhereWithAggregatesInput | ExecutionStepScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExecutionStep"> | string
    executionId?: StringWithAggregatesFilter<"ExecutionStep"> | string
    nodeId?: StringNullableWithAggregatesFilter<"ExecutionStep"> | string | null
    nodeName?: StringWithAggregatesFilter<"ExecutionStep"> | string
    nodeType?: EnumNodeTypeWithAggregatesFilter<"ExecutionStep"> | $Enums.NodeType
    status?: EnumExecutionStepStatusWithAggregatesFilter<"ExecutionStep"> | $Enums.ExecutionStepStatus
    position?: IntWithAggregatesFilter<"ExecutionStep"> | number
    attempt?: IntWithAggregatesFilter<"ExecutionStep"> | number
    input?: JsonWithAggregatesFilter<"ExecutionStep">
    output?: JsonNullableWithAggregatesFilter<"ExecutionStep">
    error?: JsonNullableWithAggregatesFilter<"ExecutionStep">
    startedAt?: DateTimeNullableWithAggregatesFilter<"ExecutionStep"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"ExecutionStep"> | Date | string | null
    durationMs?: IntNullableWithAggregatesFilter<"ExecutionStep"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ExecutionStep"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ExecutionStep"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    workflows?: WorkflowCreateNestedManyWithoutUserInput
    credentials?: CredentialCreateNestedManyWithoutUserInput
    executions?: ExecutionCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    workflows?: WorkflowUncheckedCreateNestedManyWithoutUserInput
    credentials?: CredentialUncheckedCreateNestedManyWithoutUserInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUpdateManyWithoutUserNestedInput
    credentials?: CredentialUpdateManyWithoutUserNestedInput
    executions?: ExecutionUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUncheckedUpdateManyWithoutUserNestedInput
    credentials?: CredentialUncheckedUpdateManyWithoutUserNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUncheckedCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateManyInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    nodes?: NodeCreateNestedManyWithoutWorkflowInput
    connections?: ConnectionCreateNestedManyWithoutWorkflowInput
    executions?: ExecutionCreateNestedManyWithoutWorkflowInput
    user: UserCreateNestedOneWithoutWorkflowsInput
  }

  export type WorkflowUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    nodes?: NodeUncheckedCreateNestedManyWithoutWorkflowInput
    connections?: ConnectionUncheckedCreateNestedManyWithoutWorkflowInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nodes?: NodeUpdateManyWithoutWorkflowNestedInput
    connections?: ConnectionUpdateManyWithoutWorkflowNestedInput
    executions?: ExecutionUpdateManyWithoutWorkflowNestedInput
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
  }

  export type WorkflowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    nodes?: NodeUncheckedUpdateManyWithoutWorkflowNestedInput
    connections?: ConnectionUncheckedUpdateManyWithoutWorkflowNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type WorkflowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type NodeCreateInput = {
    id?: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutNodesInput
    fromConnections?: ConnectionCreateNestedManyWithoutFromNodeInput
    toConnections?: ConnectionCreateNestedManyWithoutToNodeInput
    executionSteps?: ExecutionStepCreateNestedManyWithoutNodeInput
  }

  export type NodeUncheckedCreateInput = {
    id?: string
    workflowId: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromConnections?: ConnectionUncheckedCreateNestedManyWithoutFromNodeInput
    toConnections?: ConnectionUncheckedCreateNestedManyWithoutToNodeInput
    executionSteps?: ExecutionStepUncheckedCreateNestedManyWithoutNodeInput
  }

  export type NodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
    fromConnections?: ConnectionUpdateManyWithoutFromNodeNestedInput
    toConnections?: ConnectionUpdateManyWithoutToNodeNestedInput
    executionSteps?: ExecutionStepUpdateManyWithoutNodeNestedInput
  }

  export type NodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromConnections?: ConnectionUncheckedUpdateManyWithoutFromNodeNestedInput
    toConnections?: ConnectionUncheckedUpdateManyWithoutToNodeNestedInput
    executionSteps?: ExecutionStepUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type NodeCreateManyInput = {
    id?: string
    workflowId: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionCreateInput = {
    id?: string
    fromOutput?: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutConnectionsInput
    fromNode: NodeCreateNestedOneWithoutFromConnectionsInput
    toNode: NodeCreateNestedOneWithoutToConnectionsInput
  }

  export type ConnectionUncheckedCreateInput = {
    id?: string
    workflowId: string
    fromNodeId: string
    fromOutput?: string
    toNodeId: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutConnectionsNestedInput
    fromNode?: NodeUpdateOneRequiredWithoutFromConnectionsNestedInput
    toNode?: NodeUpdateOneRequiredWithoutToConnectionsNestedInput
  }

  export type ConnectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionCreateManyInput = {
    id?: string
    workflowId: string
    fromNodeId: string
    fromOutput?: string
    toNodeId: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredentialCreateInput = {
    id?: string
    name: string
    provider: $Enums.CredentialProvider
    description?: string | null
    encryptedData: string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCredentialsInput
  }

  export type CredentialUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    provider: $Enums.CredentialProvider
    description?: string | null
    encryptedData: string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CredentialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: EnumCredentialProviderFieldUpdateOperationsInput | $Enums.CredentialProvider
    description?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCredentialsNestedInput
  }

  export type CredentialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: EnumCredentialProviderFieldUpdateOperationsInput | $Enums.CredentialProvider
    description?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredentialCreateManyInput = {
    id?: string
    userId: string
    name: string
    provider: $Enums.CredentialProvider
    description?: string | null
    encryptedData: string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CredentialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: EnumCredentialProviderFieldUpdateOperationsInput | $Enums.CredentialProvider
    description?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredentialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: EnumCredentialProviderFieldUpdateOperationsInput | $Enums.CredentialProvider
    description?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionCreateInput = {
    id?: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutExecutionsInput
    triggeredByUser?: UserCreateNestedOneWithoutExecutionsInput
    steps?: ExecutionStepCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionUncheckedCreateInput = {
    id?: string
    workflowId: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggeredByUserId?: string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: ExecutionStepUncheckedCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutExecutionsNestedInput
    triggeredByUser?: UserUpdateOneWithoutExecutionsNestedInput
    steps?: ExecutionStepUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: ExecutionStepUncheckedUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionCreateManyInput = {
    id?: string
    workflowId: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggeredByUserId?: string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionStepCreateInput = {
    id?: string
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    execution: ExecutionCreateNestedOneWithoutStepsInput
    node?: NodeCreateNestedOneWithoutExecutionStepsInput
  }

  export type ExecutionStepUncheckedCreateInput = {
    id?: string
    executionId: string
    nodeId?: string | null
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionStepUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    execution?: ExecutionUpdateOneRequiredWithoutStepsNestedInput
    node?: NodeUpdateOneWithoutExecutionStepsNestedInput
  }

  export type ExecutionStepUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    executionId?: StringFieldUpdateOperationsInput | string
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionStepCreateManyInput = {
    id?: string
    executionId: string
    nodeId?: string | null
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionStepUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionStepUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    executionId?: StringFieldUpdateOperationsInput | string
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type WorkflowListRelationFilter = {
    every?: WorkflowWhereInput
    some?: WorkflowWhereInput
    none?: WorkflowWhereInput
  }

  export type CredentialListRelationFilter = {
    every?: CredentialWhereInput
    some?: CredentialWhereInput
    none?: CredentialWhereInput
  }

  export type ExecutionListRelationFilter = {
    every?: ExecutionWhereInput
    some?: ExecutionWhereInput
    none?: ExecutionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkflowOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CredentialOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExecutionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NodeListRelationFilter = {
    every?: NodeWhereInput
    some?: NodeWhereInput
    none?: NodeWhereInput
  }

  export type ConnectionListRelationFilter = {
    every?: ConnectionWhereInput
    some?: ConnectionWhereInput
    none?: ConnectionWhereInput
  }

  export type NodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConnectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkflowCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type WorkflowMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type WorkflowMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type EnumNodeTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeType | EnumNodeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeTypeFilter<$PrismaModel> | $Enums.NodeType
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type WorkflowScalarRelationFilter = {
    is?: WorkflowWhereInput
    isNot?: WorkflowWhereInput
  }

  export type ExecutionStepListRelationFilter = {
    every?: ExecutionStepWhereInput
    some?: ExecutionStepWhereInput
    none?: ExecutionStepWhereInput
  }

  export type ExecutionStepOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NodeCountOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    position?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NodeMaxOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NodeMinOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumNodeTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeType | EnumNodeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeTypeWithAggregatesFilter<$PrismaModel> | $Enums.NodeType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNodeTypeFilter<$PrismaModel>
    _max?: NestedEnumNodeTypeFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type NodeScalarRelationFilter = {
    is?: NodeWhereInput
    isNot?: NodeWhereInput
  }

  export type ConnectionFromNodeIdToNodeIdFromOutputToInputCompoundUniqueInput = {
    fromNodeId: string
    toNodeId: string
    fromOutput: string
    toInput: string
  }

  export type ConnectionCountOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    fromNodeId?: SortOrder
    fromOutput?: SortOrder
    toNodeId?: SortOrder
    toInput?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConnectionMaxOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    fromNodeId?: SortOrder
    fromOutput?: SortOrder
    toNodeId?: SortOrder
    toInput?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConnectionMinOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    fromNodeId?: SortOrder
    fromOutput?: SortOrder
    toNodeId?: SortOrder
    toInput?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumCredentialProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.CredentialProvider | EnumCredentialProviderFieldRefInput<$PrismaModel>
    in?: $Enums.CredentialProvider[] | ListEnumCredentialProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.CredentialProvider[] | ListEnumCredentialProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumCredentialProviderFilter<$PrismaModel> | $Enums.CredentialProvider
  }

  export type CredentialUserIdNameCompoundUniqueInput = {
    userId: string
    name: string
  }

  export type CredentialCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    description?: SortOrder
    encryptedData?: SortOrder
    metadata?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CredentialMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    description?: SortOrder
    encryptedData?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CredentialMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    description?: SortOrder
    encryptedData?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumCredentialProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CredentialProvider | EnumCredentialProviderFieldRefInput<$PrismaModel>
    in?: $Enums.CredentialProvider[] | ListEnumCredentialProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.CredentialProvider[] | ListEnumCredentialProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumCredentialProviderWithAggregatesFilter<$PrismaModel> | $Enums.CredentialProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCredentialProviderFilter<$PrismaModel>
    _max?: NestedEnumCredentialProviderFilter<$PrismaModel>
  }

  export type EnumExecutionTriggerTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionTriggerType | EnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionTriggerType[] | ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionTriggerType[] | ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionTriggerTypeFilter<$PrismaModel> | $Enums.ExecutionTriggerType
  }

  export type EnumExecutionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStatus | EnumExecutionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStatusFilter<$PrismaModel> | $Enums.ExecutionStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ExecutionCountOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    triggerType?: SortOrder
    status?: SortOrder
    triggeredByUserId?: SortOrder
    triggerPayload?: SortOrder
    state?: SortOrder
    workflowSnapshot?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExecutionMaxOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    triggerType?: SortOrder
    status?: SortOrder
    triggeredByUserId?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExecutionMinOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    triggerType?: SortOrder
    status?: SortOrder
    triggeredByUserId?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumExecutionTriggerTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionTriggerType | EnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionTriggerType[] | ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionTriggerType[] | ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionTriggerTypeWithAggregatesFilter<$PrismaModel> | $Enums.ExecutionTriggerType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExecutionTriggerTypeFilter<$PrismaModel>
    _max?: NestedEnumExecutionTriggerTypeFilter<$PrismaModel>
  }

  export type EnumExecutionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStatus | EnumExecutionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExecutionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExecutionStatusFilter<$PrismaModel>
    _max?: NestedEnumExecutionStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumExecutionStepStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStepStatus | EnumExecutionStepStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStepStatus[] | ListEnumExecutionStepStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStepStatus[] | ListEnumExecutionStepStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStepStatusFilter<$PrismaModel> | $Enums.ExecutionStepStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ExecutionScalarRelationFilter = {
    is?: ExecutionWhereInput
    isNot?: ExecutionWhereInput
  }

  export type NodeNullableScalarRelationFilter = {
    is?: NodeWhereInput | null
    isNot?: NodeWhereInput | null
  }

  export type ExecutionStepCountOrderByAggregateInput = {
    id?: SortOrder
    executionId?: SortOrder
    nodeId?: SortOrder
    nodeName?: SortOrder
    nodeType?: SortOrder
    status?: SortOrder
    position?: SortOrder
    attempt?: SortOrder
    input?: SortOrder
    output?: SortOrder
    error?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    durationMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExecutionStepAvgOrderByAggregateInput = {
    position?: SortOrder
    attempt?: SortOrder
    durationMs?: SortOrder
  }

  export type ExecutionStepMaxOrderByAggregateInput = {
    id?: SortOrder
    executionId?: SortOrder
    nodeId?: SortOrder
    nodeName?: SortOrder
    nodeType?: SortOrder
    status?: SortOrder
    position?: SortOrder
    attempt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    durationMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExecutionStepMinOrderByAggregateInput = {
    id?: SortOrder
    executionId?: SortOrder
    nodeId?: SortOrder
    nodeName?: SortOrder
    nodeType?: SortOrder
    status?: SortOrder
    position?: SortOrder
    attempt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    durationMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExecutionStepSumOrderByAggregateInput = {
    position?: SortOrder
    attempt?: SortOrder
    durationMs?: SortOrder
  }

  export type EnumExecutionStepStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStepStatus | EnumExecutionStepStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStepStatus[] | ListEnumExecutionStepStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStepStatus[] | ListEnumExecutionStepStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStepStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExecutionStepStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExecutionStepStatusFilter<$PrismaModel>
    _max?: NestedEnumExecutionStepStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type WorkflowCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput> | WorkflowCreateWithoutUserInput[] | WorkflowUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkflowCreateOrConnectWithoutUserInput | WorkflowCreateOrConnectWithoutUserInput[]
    createMany?: WorkflowCreateManyUserInputEnvelope
    connect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
  }

  export type CredentialCreateNestedManyWithoutUserInput = {
    create?: XOR<CredentialCreateWithoutUserInput, CredentialUncheckedCreateWithoutUserInput> | CredentialCreateWithoutUserInput[] | CredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CredentialCreateOrConnectWithoutUserInput | CredentialCreateOrConnectWithoutUserInput[]
    createMany?: CredentialCreateManyUserInputEnvelope
    connect?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
  }

  export type ExecutionCreateNestedManyWithoutTriggeredByUserInput = {
    create?: XOR<ExecutionCreateWithoutTriggeredByUserInput, ExecutionUncheckedCreateWithoutTriggeredByUserInput> | ExecutionCreateWithoutTriggeredByUserInput[] | ExecutionUncheckedCreateWithoutTriggeredByUserInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutTriggeredByUserInput | ExecutionCreateOrConnectWithoutTriggeredByUserInput[]
    createMany?: ExecutionCreateManyTriggeredByUserInputEnvelope
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type WorkflowUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput> | WorkflowCreateWithoutUserInput[] | WorkflowUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkflowCreateOrConnectWithoutUserInput | WorkflowCreateOrConnectWithoutUserInput[]
    createMany?: WorkflowCreateManyUserInputEnvelope
    connect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
  }

  export type CredentialUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CredentialCreateWithoutUserInput, CredentialUncheckedCreateWithoutUserInput> | CredentialCreateWithoutUserInput[] | CredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CredentialCreateOrConnectWithoutUserInput | CredentialCreateOrConnectWithoutUserInput[]
    createMany?: CredentialCreateManyUserInputEnvelope
    connect?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
  }

  export type ExecutionUncheckedCreateNestedManyWithoutTriggeredByUserInput = {
    create?: XOR<ExecutionCreateWithoutTriggeredByUserInput, ExecutionUncheckedCreateWithoutTriggeredByUserInput> | ExecutionCreateWithoutTriggeredByUserInput[] | ExecutionUncheckedCreateWithoutTriggeredByUserInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutTriggeredByUserInput | ExecutionCreateOrConnectWithoutTriggeredByUserInput[]
    createMany?: ExecutionCreateManyTriggeredByUserInputEnvelope
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type WorkflowUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput> | WorkflowCreateWithoutUserInput[] | WorkflowUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkflowCreateOrConnectWithoutUserInput | WorkflowCreateOrConnectWithoutUserInput[]
    upsert?: WorkflowUpsertWithWhereUniqueWithoutUserInput | WorkflowUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkflowCreateManyUserInputEnvelope
    set?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    disconnect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    delete?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    connect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    update?: WorkflowUpdateWithWhereUniqueWithoutUserInput | WorkflowUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkflowUpdateManyWithWhereWithoutUserInput | WorkflowUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkflowScalarWhereInput | WorkflowScalarWhereInput[]
  }

  export type CredentialUpdateManyWithoutUserNestedInput = {
    create?: XOR<CredentialCreateWithoutUserInput, CredentialUncheckedCreateWithoutUserInput> | CredentialCreateWithoutUserInput[] | CredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CredentialCreateOrConnectWithoutUserInput | CredentialCreateOrConnectWithoutUserInput[]
    upsert?: CredentialUpsertWithWhereUniqueWithoutUserInput | CredentialUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CredentialCreateManyUserInputEnvelope
    set?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
    disconnect?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
    delete?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
    connect?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
    update?: CredentialUpdateWithWhereUniqueWithoutUserInput | CredentialUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CredentialUpdateManyWithWhereWithoutUserInput | CredentialUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CredentialScalarWhereInput | CredentialScalarWhereInput[]
  }

  export type ExecutionUpdateManyWithoutTriggeredByUserNestedInput = {
    create?: XOR<ExecutionCreateWithoutTriggeredByUserInput, ExecutionUncheckedCreateWithoutTriggeredByUserInput> | ExecutionCreateWithoutTriggeredByUserInput[] | ExecutionUncheckedCreateWithoutTriggeredByUserInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutTriggeredByUserInput | ExecutionCreateOrConnectWithoutTriggeredByUserInput[]
    upsert?: ExecutionUpsertWithWhereUniqueWithoutTriggeredByUserInput | ExecutionUpsertWithWhereUniqueWithoutTriggeredByUserInput[]
    createMany?: ExecutionCreateManyTriggeredByUserInputEnvelope
    set?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    disconnect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    delete?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    update?: ExecutionUpdateWithWhereUniqueWithoutTriggeredByUserInput | ExecutionUpdateWithWhereUniqueWithoutTriggeredByUserInput[]
    updateMany?: ExecutionUpdateManyWithWhereWithoutTriggeredByUserInput | ExecutionUpdateManyWithWhereWithoutTriggeredByUserInput[]
    deleteMany?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type WorkflowUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput> | WorkflowCreateWithoutUserInput[] | WorkflowUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkflowCreateOrConnectWithoutUserInput | WorkflowCreateOrConnectWithoutUserInput[]
    upsert?: WorkflowUpsertWithWhereUniqueWithoutUserInput | WorkflowUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkflowCreateManyUserInputEnvelope
    set?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    disconnect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    delete?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    connect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    update?: WorkflowUpdateWithWhereUniqueWithoutUserInput | WorkflowUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkflowUpdateManyWithWhereWithoutUserInput | WorkflowUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkflowScalarWhereInput | WorkflowScalarWhereInput[]
  }

  export type CredentialUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CredentialCreateWithoutUserInput, CredentialUncheckedCreateWithoutUserInput> | CredentialCreateWithoutUserInput[] | CredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CredentialCreateOrConnectWithoutUserInput | CredentialCreateOrConnectWithoutUserInput[]
    upsert?: CredentialUpsertWithWhereUniqueWithoutUserInput | CredentialUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CredentialCreateManyUserInputEnvelope
    set?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
    disconnect?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
    delete?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
    connect?: CredentialWhereUniqueInput | CredentialWhereUniqueInput[]
    update?: CredentialUpdateWithWhereUniqueWithoutUserInput | CredentialUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CredentialUpdateManyWithWhereWithoutUserInput | CredentialUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CredentialScalarWhereInput | CredentialScalarWhereInput[]
  }

  export type ExecutionUncheckedUpdateManyWithoutTriggeredByUserNestedInput = {
    create?: XOR<ExecutionCreateWithoutTriggeredByUserInput, ExecutionUncheckedCreateWithoutTriggeredByUserInput> | ExecutionCreateWithoutTriggeredByUserInput[] | ExecutionUncheckedCreateWithoutTriggeredByUserInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutTriggeredByUserInput | ExecutionCreateOrConnectWithoutTriggeredByUserInput[]
    upsert?: ExecutionUpsertWithWhereUniqueWithoutTriggeredByUserInput | ExecutionUpsertWithWhereUniqueWithoutTriggeredByUserInput[]
    createMany?: ExecutionCreateManyTriggeredByUserInputEnvelope
    set?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    disconnect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    delete?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    update?: ExecutionUpdateWithWhereUniqueWithoutTriggeredByUserInput | ExecutionUpdateWithWhereUniqueWithoutTriggeredByUserInput[]
    updateMany?: ExecutionUpdateManyWithWhereWithoutTriggeredByUserInput | ExecutionUpdateManyWithWhereWithoutTriggeredByUserInput[]
    deleteMany?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type NodeCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<NodeCreateWithoutWorkflowInput, NodeUncheckedCreateWithoutWorkflowInput> | NodeCreateWithoutWorkflowInput[] | NodeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: NodeCreateOrConnectWithoutWorkflowInput | NodeCreateOrConnectWithoutWorkflowInput[]
    createMany?: NodeCreateManyWorkflowInputEnvelope
    connect?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
  }

  export type ConnectionCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<ConnectionCreateWithoutWorkflowInput, ConnectionUncheckedCreateWithoutWorkflowInput> | ConnectionCreateWithoutWorkflowInput[] | ConnectionUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutWorkflowInput | ConnectionCreateOrConnectWithoutWorkflowInput[]
    createMany?: ConnectionCreateManyWorkflowInputEnvelope
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
  }

  export type ExecutionCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<ExecutionCreateWithoutWorkflowInput, ExecutionUncheckedCreateWithoutWorkflowInput> | ExecutionCreateWithoutWorkflowInput[] | ExecutionUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutWorkflowInput | ExecutionCreateOrConnectWithoutWorkflowInput[]
    createMany?: ExecutionCreateManyWorkflowInputEnvelope
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutWorkflowsInput = {
    create?: XOR<UserCreateWithoutWorkflowsInput, UserUncheckedCreateWithoutWorkflowsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkflowsInput
    connect?: UserWhereUniqueInput
  }

  export type NodeUncheckedCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<NodeCreateWithoutWorkflowInput, NodeUncheckedCreateWithoutWorkflowInput> | NodeCreateWithoutWorkflowInput[] | NodeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: NodeCreateOrConnectWithoutWorkflowInput | NodeCreateOrConnectWithoutWorkflowInput[]
    createMany?: NodeCreateManyWorkflowInputEnvelope
    connect?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
  }

  export type ConnectionUncheckedCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<ConnectionCreateWithoutWorkflowInput, ConnectionUncheckedCreateWithoutWorkflowInput> | ConnectionCreateWithoutWorkflowInput[] | ConnectionUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutWorkflowInput | ConnectionCreateOrConnectWithoutWorkflowInput[]
    createMany?: ConnectionCreateManyWorkflowInputEnvelope
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
  }

  export type ExecutionUncheckedCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<ExecutionCreateWithoutWorkflowInput, ExecutionUncheckedCreateWithoutWorkflowInput> | ExecutionCreateWithoutWorkflowInput[] | ExecutionUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutWorkflowInput | ExecutionCreateOrConnectWithoutWorkflowInput[]
    createMany?: ExecutionCreateManyWorkflowInputEnvelope
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
  }

  export type NodeUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<NodeCreateWithoutWorkflowInput, NodeUncheckedCreateWithoutWorkflowInput> | NodeCreateWithoutWorkflowInput[] | NodeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: NodeCreateOrConnectWithoutWorkflowInput | NodeCreateOrConnectWithoutWorkflowInput[]
    upsert?: NodeUpsertWithWhereUniqueWithoutWorkflowInput | NodeUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: NodeCreateManyWorkflowInputEnvelope
    set?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
    disconnect?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
    delete?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
    connect?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
    update?: NodeUpdateWithWhereUniqueWithoutWorkflowInput | NodeUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: NodeUpdateManyWithWhereWithoutWorkflowInput | NodeUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: NodeScalarWhereInput | NodeScalarWhereInput[]
  }

  export type ConnectionUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<ConnectionCreateWithoutWorkflowInput, ConnectionUncheckedCreateWithoutWorkflowInput> | ConnectionCreateWithoutWorkflowInput[] | ConnectionUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutWorkflowInput | ConnectionCreateOrConnectWithoutWorkflowInput[]
    upsert?: ConnectionUpsertWithWhereUniqueWithoutWorkflowInput | ConnectionUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: ConnectionCreateManyWorkflowInputEnvelope
    set?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    disconnect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    delete?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    update?: ConnectionUpdateWithWhereUniqueWithoutWorkflowInput | ConnectionUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: ConnectionUpdateManyWithWhereWithoutWorkflowInput | ConnectionUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: ConnectionScalarWhereInput | ConnectionScalarWhereInput[]
  }

  export type ExecutionUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<ExecutionCreateWithoutWorkflowInput, ExecutionUncheckedCreateWithoutWorkflowInput> | ExecutionCreateWithoutWorkflowInput[] | ExecutionUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutWorkflowInput | ExecutionCreateOrConnectWithoutWorkflowInput[]
    upsert?: ExecutionUpsertWithWhereUniqueWithoutWorkflowInput | ExecutionUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: ExecutionCreateManyWorkflowInputEnvelope
    set?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    disconnect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    delete?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    update?: ExecutionUpdateWithWhereUniqueWithoutWorkflowInput | ExecutionUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: ExecutionUpdateManyWithWhereWithoutWorkflowInput | ExecutionUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutWorkflowsNestedInput = {
    create?: XOR<UserCreateWithoutWorkflowsInput, UserUncheckedCreateWithoutWorkflowsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkflowsInput
    upsert?: UserUpsertWithoutWorkflowsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWorkflowsInput, UserUpdateWithoutWorkflowsInput>, UserUncheckedUpdateWithoutWorkflowsInput>
  }

  export type NodeUncheckedUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<NodeCreateWithoutWorkflowInput, NodeUncheckedCreateWithoutWorkflowInput> | NodeCreateWithoutWorkflowInput[] | NodeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: NodeCreateOrConnectWithoutWorkflowInput | NodeCreateOrConnectWithoutWorkflowInput[]
    upsert?: NodeUpsertWithWhereUniqueWithoutWorkflowInput | NodeUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: NodeCreateManyWorkflowInputEnvelope
    set?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
    disconnect?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
    delete?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
    connect?: NodeWhereUniqueInput | NodeWhereUniqueInput[]
    update?: NodeUpdateWithWhereUniqueWithoutWorkflowInput | NodeUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: NodeUpdateManyWithWhereWithoutWorkflowInput | NodeUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: NodeScalarWhereInput | NodeScalarWhereInput[]
  }

  export type ConnectionUncheckedUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<ConnectionCreateWithoutWorkflowInput, ConnectionUncheckedCreateWithoutWorkflowInput> | ConnectionCreateWithoutWorkflowInput[] | ConnectionUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutWorkflowInput | ConnectionCreateOrConnectWithoutWorkflowInput[]
    upsert?: ConnectionUpsertWithWhereUniqueWithoutWorkflowInput | ConnectionUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: ConnectionCreateManyWorkflowInputEnvelope
    set?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    disconnect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    delete?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    update?: ConnectionUpdateWithWhereUniqueWithoutWorkflowInput | ConnectionUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: ConnectionUpdateManyWithWhereWithoutWorkflowInput | ConnectionUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: ConnectionScalarWhereInput | ConnectionScalarWhereInput[]
  }

  export type ExecutionUncheckedUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<ExecutionCreateWithoutWorkflowInput, ExecutionUncheckedCreateWithoutWorkflowInput> | ExecutionCreateWithoutWorkflowInput[] | ExecutionUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutWorkflowInput | ExecutionCreateOrConnectWithoutWorkflowInput[]
    upsert?: ExecutionUpsertWithWhereUniqueWithoutWorkflowInput | ExecutionUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: ExecutionCreateManyWorkflowInputEnvelope
    set?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    disconnect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    delete?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    update?: ExecutionUpdateWithWhereUniqueWithoutWorkflowInput | ExecutionUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: ExecutionUpdateManyWithWhereWithoutWorkflowInput | ExecutionUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
  }

  export type WorkflowCreateNestedOneWithoutNodesInput = {
    create?: XOR<WorkflowCreateWithoutNodesInput, WorkflowUncheckedCreateWithoutNodesInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutNodesInput
    connect?: WorkflowWhereUniqueInput
  }

  export type ConnectionCreateNestedManyWithoutFromNodeInput = {
    create?: XOR<ConnectionCreateWithoutFromNodeInput, ConnectionUncheckedCreateWithoutFromNodeInput> | ConnectionCreateWithoutFromNodeInput[] | ConnectionUncheckedCreateWithoutFromNodeInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutFromNodeInput | ConnectionCreateOrConnectWithoutFromNodeInput[]
    createMany?: ConnectionCreateManyFromNodeInputEnvelope
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
  }

  export type ConnectionCreateNestedManyWithoutToNodeInput = {
    create?: XOR<ConnectionCreateWithoutToNodeInput, ConnectionUncheckedCreateWithoutToNodeInput> | ConnectionCreateWithoutToNodeInput[] | ConnectionUncheckedCreateWithoutToNodeInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutToNodeInput | ConnectionCreateOrConnectWithoutToNodeInput[]
    createMany?: ConnectionCreateManyToNodeInputEnvelope
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
  }

  export type ExecutionStepCreateNestedManyWithoutNodeInput = {
    create?: XOR<ExecutionStepCreateWithoutNodeInput, ExecutionStepUncheckedCreateWithoutNodeInput> | ExecutionStepCreateWithoutNodeInput[] | ExecutionStepUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: ExecutionStepCreateOrConnectWithoutNodeInput | ExecutionStepCreateOrConnectWithoutNodeInput[]
    createMany?: ExecutionStepCreateManyNodeInputEnvelope
    connect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
  }

  export type ConnectionUncheckedCreateNestedManyWithoutFromNodeInput = {
    create?: XOR<ConnectionCreateWithoutFromNodeInput, ConnectionUncheckedCreateWithoutFromNodeInput> | ConnectionCreateWithoutFromNodeInput[] | ConnectionUncheckedCreateWithoutFromNodeInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutFromNodeInput | ConnectionCreateOrConnectWithoutFromNodeInput[]
    createMany?: ConnectionCreateManyFromNodeInputEnvelope
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
  }

  export type ConnectionUncheckedCreateNestedManyWithoutToNodeInput = {
    create?: XOR<ConnectionCreateWithoutToNodeInput, ConnectionUncheckedCreateWithoutToNodeInput> | ConnectionCreateWithoutToNodeInput[] | ConnectionUncheckedCreateWithoutToNodeInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutToNodeInput | ConnectionCreateOrConnectWithoutToNodeInput[]
    createMany?: ConnectionCreateManyToNodeInputEnvelope
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
  }

  export type ExecutionStepUncheckedCreateNestedManyWithoutNodeInput = {
    create?: XOR<ExecutionStepCreateWithoutNodeInput, ExecutionStepUncheckedCreateWithoutNodeInput> | ExecutionStepCreateWithoutNodeInput[] | ExecutionStepUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: ExecutionStepCreateOrConnectWithoutNodeInput | ExecutionStepCreateOrConnectWithoutNodeInput[]
    createMany?: ExecutionStepCreateManyNodeInputEnvelope
    connect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
  }

  export type EnumNodeTypeFieldUpdateOperationsInput = {
    set?: $Enums.NodeType
  }

  export type WorkflowUpdateOneRequiredWithoutNodesNestedInput = {
    create?: XOR<WorkflowCreateWithoutNodesInput, WorkflowUncheckedCreateWithoutNodesInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutNodesInput
    upsert?: WorkflowUpsertWithoutNodesInput
    connect?: WorkflowWhereUniqueInput
    update?: XOR<XOR<WorkflowUpdateToOneWithWhereWithoutNodesInput, WorkflowUpdateWithoutNodesInput>, WorkflowUncheckedUpdateWithoutNodesInput>
  }

  export type ConnectionUpdateManyWithoutFromNodeNestedInput = {
    create?: XOR<ConnectionCreateWithoutFromNodeInput, ConnectionUncheckedCreateWithoutFromNodeInput> | ConnectionCreateWithoutFromNodeInput[] | ConnectionUncheckedCreateWithoutFromNodeInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutFromNodeInput | ConnectionCreateOrConnectWithoutFromNodeInput[]
    upsert?: ConnectionUpsertWithWhereUniqueWithoutFromNodeInput | ConnectionUpsertWithWhereUniqueWithoutFromNodeInput[]
    createMany?: ConnectionCreateManyFromNodeInputEnvelope
    set?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    disconnect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    delete?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    update?: ConnectionUpdateWithWhereUniqueWithoutFromNodeInput | ConnectionUpdateWithWhereUniqueWithoutFromNodeInput[]
    updateMany?: ConnectionUpdateManyWithWhereWithoutFromNodeInput | ConnectionUpdateManyWithWhereWithoutFromNodeInput[]
    deleteMany?: ConnectionScalarWhereInput | ConnectionScalarWhereInput[]
  }

  export type ConnectionUpdateManyWithoutToNodeNestedInput = {
    create?: XOR<ConnectionCreateWithoutToNodeInput, ConnectionUncheckedCreateWithoutToNodeInput> | ConnectionCreateWithoutToNodeInput[] | ConnectionUncheckedCreateWithoutToNodeInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutToNodeInput | ConnectionCreateOrConnectWithoutToNodeInput[]
    upsert?: ConnectionUpsertWithWhereUniqueWithoutToNodeInput | ConnectionUpsertWithWhereUniqueWithoutToNodeInput[]
    createMany?: ConnectionCreateManyToNodeInputEnvelope
    set?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    disconnect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    delete?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    update?: ConnectionUpdateWithWhereUniqueWithoutToNodeInput | ConnectionUpdateWithWhereUniqueWithoutToNodeInput[]
    updateMany?: ConnectionUpdateManyWithWhereWithoutToNodeInput | ConnectionUpdateManyWithWhereWithoutToNodeInput[]
    deleteMany?: ConnectionScalarWhereInput | ConnectionScalarWhereInput[]
  }

  export type ExecutionStepUpdateManyWithoutNodeNestedInput = {
    create?: XOR<ExecutionStepCreateWithoutNodeInput, ExecutionStepUncheckedCreateWithoutNodeInput> | ExecutionStepCreateWithoutNodeInput[] | ExecutionStepUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: ExecutionStepCreateOrConnectWithoutNodeInput | ExecutionStepCreateOrConnectWithoutNodeInput[]
    upsert?: ExecutionStepUpsertWithWhereUniqueWithoutNodeInput | ExecutionStepUpsertWithWhereUniqueWithoutNodeInput[]
    createMany?: ExecutionStepCreateManyNodeInputEnvelope
    set?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    disconnect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    delete?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    connect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    update?: ExecutionStepUpdateWithWhereUniqueWithoutNodeInput | ExecutionStepUpdateWithWhereUniqueWithoutNodeInput[]
    updateMany?: ExecutionStepUpdateManyWithWhereWithoutNodeInput | ExecutionStepUpdateManyWithWhereWithoutNodeInput[]
    deleteMany?: ExecutionStepScalarWhereInput | ExecutionStepScalarWhereInput[]
  }

  export type ConnectionUncheckedUpdateManyWithoutFromNodeNestedInput = {
    create?: XOR<ConnectionCreateWithoutFromNodeInput, ConnectionUncheckedCreateWithoutFromNodeInput> | ConnectionCreateWithoutFromNodeInput[] | ConnectionUncheckedCreateWithoutFromNodeInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutFromNodeInput | ConnectionCreateOrConnectWithoutFromNodeInput[]
    upsert?: ConnectionUpsertWithWhereUniqueWithoutFromNodeInput | ConnectionUpsertWithWhereUniqueWithoutFromNodeInput[]
    createMany?: ConnectionCreateManyFromNodeInputEnvelope
    set?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    disconnect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    delete?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    update?: ConnectionUpdateWithWhereUniqueWithoutFromNodeInput | ConnectionUpdateWithWhereUniqueWithoutFromNodeInput[]
    updateMany?: ConnectionUpdateManyWithWhereWithoutFromNodeInput | ConnectionUpdateManyWithWhereWithoutFromNodeInput[]
    deleteMany?: ConnectionScalarWhereInput | ConnectionScalarWhereInput[]
  }

  export type ConnectionUncheckedUpdateManyWithoutToNodeNestedInput = {
    create?: XOR<ConnectionCreateWithoutToNodeInput, ConnectionUncheckedCreateWithoutToNodeInput> | ConnectionCreateWithoutToNodeInput[] | ConnectionUncheckedCreateWithoutToNodeInput[]
    connectOrCreate?: ConnectionCreateOrConnectWithoutToNodeInput | ConnectionCreateOrConnectWithoutToNodeInput[]
    upsert?: ConnectionUpsertWithWhereUniqueWithoutToNodeInput | ConnectionUpsertWithWhereUniqueWithoutToNodeInput[]
    createMany?: ConnectionCreateManyToNodeInputEnvelope
    set?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    disconnect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    delete?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    connect?: ConnectionWhereUniqueInput | ConnectionWhereUniqueInput[]
    update?: ConnectionUpdateWithWhereUniqueWithoutToNodeInput | ConnectionUpdateWithWhereUniqueWithoutToNodeInput[]
    updateMany?: ConnectionUpdateManyWithWhereWithoutToNodeInput | ConnectionUpdateManyWithWhereWithoutToNodeInput[]
    deleteMany?: ConnectionScalarWhereInput | ConnectionScalarWhereInput[]
  }

  export type ExecutionStepUncheckedUpdateManyWithoutNodeNestedInput = {
    create?: XOR<ExecutionStepCreateWithoutNodeInput, ExecutionStepUncheckedCreateWithoutNodeInput> | ExecutionStepCreateWithoutNodeInput[] | ExecutionStepUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: ExecutionStepCreateOrConnectWithoutNodeInput | ExecutionStepCreateOrConnectWithoutNodeInput[]
    upsert?: ExecutionStepUpsertWithWhereUniqueWithoutNodeInput | ExecutionStepUpsertWithWhereUniqueWithoutNodeInput[]
    createMany?: ExecutionStepCreateManyNodeInputEnvelope
    set?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    disconnect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    delete?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    connect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    update?: ExecutionStepUpdateWithWhereUniqueWithoutNodeInput | ExecutionStepUpdateWithWhereUniqueWithoutNodeInput[]
    updateMany?: ExecutionStepUpdateManyWithWhereWithoutNodeInput | ExecutionStepUpdateManyWithWhereWithoutNodeInput[]
    deleteMany?: ExecutionStepScalarWhereInput | ExecutionStepScalarWhereInput[]
  }

  export type WorkflowCreateNestedOneWithoutConnectionsInput = {
    create?: XOR<WorkflowCreateWithoutConnectionsInput, WorkflowUncheckedCreateWithoutConnectionsInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutConnectionsInput
    connect?: WorkflowWhereUniqueInput
  }

  export type NodeCreateNestedOneWithoutFromConnectionsInput = {
    create?: XOR<NodeCreateWithoutFromConnectionsInput, NodeUncheckedCreateWithoutFromConnectionsInput>
    connectOrCreate?: NodeCreateOrConnectWithoutFromConnectionsInput
    connect?: NodeWhereUniqueInput
  }

  export type NodeCreateNestedOneWithoutToConnectionsInput = {
    create?: XOR<NodeCreateWithoutToConnectionsInput, NodeUncheckedCreateWithoutToConnectionsInput>
    connectOrCreate?: NodeCreateOrConnectWithoutToConnectionsInput
    connect?: NodeWhereUniqueInput
  }

  export type WorkflowUpdateOneRequiredWithoutConnectionsNestedInput = {
    create?: XOR<WorkflowCreateWithoutConnectionsInput, WorkflowUncheckedCreateWithoutConnectionsInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutConnectionsInput
    upsert?: WorkflowUpsertWithoutConnectionsInput
    connect?: WorkflowWhereUniqueInput
    update?: XOR<XOR<WorkflowUpdateToOneWithWhereWithoutConnectionsInput, WorkflowUpdateWithoutConnectionsInput>, WorkflowUncheckedUpdateWithoutConnectionsInput>
  }

  export type NodeUpdateOneRequiredWithoutFromConnectionsNestedInput = {
    create?: XOR<NodeCreateWithoutFromConnectionsInput, NodeUncheckedCreateWithoutFromConnectionsInput>
    connectOrCreate?: NodeCreateOrConnectWithoutFromConnectionsInput
    upsert?: NodeUpsertWithoutFromConnectionsInput
    connect?: NodeWhereUniqueInput
    update?: XOR<XOR<NodeUpdateToOneWithWhereWithoutFromConnectionsInput, NodeUpdateWithoutFromConnectionsInput>, NodeUncheckedUpdateWithoutFromConnectionsInput>
  }

  export type NodeUpdateOneRequiredWithoutToConnectionsNestedInput = {
    create?: XOR<NodeCreateWithoutToConnectionsInput, NodeUncheckedCreateWithoutToConnectionsInput>
    connectOrCreate?: NodeCreateOrConnectWithoutToConnectionsInput
    upsert?: NodeUpsertWithoutToConnectionsInput
    connect?: NodeWhereUniqueInput
    update?: XOR<XOR<NodeUpdateToOneWithWhereWithoutToConnectionsInput, NodeUpdateWithoutToConnectionsInput>, NodeUncheckedUpdateWithoutToConnectionsInput>
  }

  export type UserCreateNestedOneWithoutCredentialsInput = {
    create?: XOR<UserCreateWithoutCredentialsInput, UserUncheckedCreateWithoutCredentialsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCredentialsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumCredentialProviderFieldUpdateOperationsInput = {
    set?: $Enums.CredentialProvider
  }

  export type UserUpdateOneRequiredWithoutCredentialsNestedInput = {
    create?: XOR<UserCreateWithoutCredentialsInput, UserUncheckedCreateWithoutCredentialsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCredentialsInput
    upsert?: UserUpsertWithoutCredentialsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCredentialsInput, UserUpdateWithoutCredentialsInput>, UserUncheckedUpdateWithoutCredentialsInput>
  }

  export type WorkflowCreateNestedOneWithoutExecutionsInput = {
    create?: XOR<WorkflowCreateWithoutExecutionsInput, WorkflowUncheckedCreateWithoutExecutionsInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutExecutionsInput
    connect?: WorkflowWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutExecutionsInput = {
    create?: XOR<UserCreateWithoutExecutionsInput, UserUncheckedCreateWithoutExecutionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExecutionsInput
    connect?: UserWhereUniqueInput
  }

  export type ExecutionStepCreateNestedManyWithoutExecutionInput = {
    create?: XOR<ExecutionStepCreateWithoutExecutionInput, ExecutionStepUncheckedCreateWithoutExecutionInput> | ExecutionStepCreateWithoutExecutionInput[] | ExecutionStepUncheckedCreateWithoutExecutionInput[]
    connectOrCreate?: ExecutionStepCreateOrConnectWithoutExecutionInput | ExecutionStepCreateOrConnectWithoutExecutionInput[]
    createMany?: ExecutionStepCreateManyExecutionInputEnvelope
    connect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
  }

  export type ExecutionStepUncheckedCreateNestedManyWithoutExecutionInput = {
    create?: XOR<ExecutionStepCreateWithoutExecutionInput, ExecutionStepUncheckedCreateWithoutExecutionInput> | ExecutionStepCreateWithoutExecutionInput[] | ExecutionStepUncheckedCreateWithoutExecutionInput[]
    connectOrCreate?: ExecutionStepCreateOrConnectWithoutExecutionInput | ExecutionStepCreateOrConnectWithoutExecutionInput[]
    createMany?: ExecutionStepCreateManyExecutionInputEnvelope
    connect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
  }

  export type EnumExecutionTriggerTypeFieldUpdateOperationsInput = {
    set?: $Enums.ExecutionTriggerType
  }

  export type EnumExecutionStatusFieldUpdateOperationsInput = {
    set?: $Enums.ExecutionStatus
  }

  export type WorkflowUpdateOneRequiredWithoutExecutionsNestedInput = {
    create?: XOR<WorkflowCreateWithoutExecutionsInput, WorkflowUncheckedCreateWithoutExecutionsInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutExecutionsInput
    upsert?: WorkflowUpsertWithoutExecutionsInput
    connect?: WorkflowWhereUniqueInput
    update?: XOR<XOR<WorkflowUpdateToOneWithWhereWithoutExecutionsInput, WorkflowUpdateWithoutExecutionsInput>, WorkflowUncheckedUpdateWithoutExecutionsInput>
  }

  export type UserUpdateOneWithoutExecutionsNestedInput = {
    create?: XOR<UserCreateWithoutExecutionsInput, UserUncheckedCreateWithoutExecutionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExecutionsInput
    upsert?: UserUpsertWithoutExecutionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExecutionsInput, UserUpdateWithoutExecutionsInput>, UserUncheckedUpdateWithoutExecutionsInput>
  }

  export type ExecutionStepUpdateManyWithoutExecutionNestedInput = {
    create?: XOR<ExecutionStepCreateWithoutExecutionInput, ExecutionStepUncheckedCreateWithoutExecutionInput> | ExecutionStepCreateWithoutExecutionInput[] | ExecutionStepUncheckedCreateWithoutExecutionInput[]
    connectOrCreate?: ExecutionStepCreateOrConnectWithoutExecutionInput | ExecutionStepCreateOrConnectWithoutExecutionInput[]
    upsert?: ExecutionStepUpsertWithWhereUniqueWithoutExecutionInput | ExecutionStepUpsertWithWhereUniqueWithoutExecutionInput[]
    createMany?: ExecutionStepCreateManyExecutionInputEnvelope
    set?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    disconnect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    delete?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    connect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    update?: ExecutionStepUpdateWithWhereUniqueWithoutExecutionInput | ExecutionStepUpdateWithWhereUniqueWithoutExecutionInput[]
    updateMany?: ExecutionStepUpdateManyWithWhereWithoutExecutionInput | ExecutionStepUpdateManyWithWhereWithoutExecutionInput[]
    deleteMany?: ExecutionStepScalarWhereInput | ExecutionStepScalarWhereInput[]
  }

  export type ExecutionStepUncheckedUpdateManyWithoutExecutionNestedInput = {
    create?: XOR<ExecutionStepCreateWithoutExecutionInput, ExecutionStepUncheckedCreateWithoutExecutionInput> | ExecutionStepCreateWithoutExecutionInput[] | ExecutionStepUncheckedCreateWithoutExecutionInput[]
    connectOrCreate?: ExecutionStepCreateOrConnectWithoutExecutionInput | ExecutionStepCreateOrConnectWithoutExecutionInput[]
    upsert?: ExecutionStepUpsertWithWhereUniqueWithoutExecutionInput | ExecutionStepUpsertWithWhereUniqueWithoutExecutionInput[]
    createMany?: ExecutionStepCreateManyExecutionInputEnvelope
    set?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    disconnect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    delete?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    connect?: ExecutionStepWhereUniqueInput | ExecutionStepWhereUniqueInput[]
    update?: ExecutionStepUpdateWithWhereUniqueWithoutExecutionInput | ExecutionStepUpdateWithWhereUniqueWithoutExecutionInput[]
    updateMany?: ExecutionStepUpdateManyWithWhereWithoutExecutionInput | ExecutionStepUpdateManyWithWhereWithoutExecutionInput[]
    deleteMany?: ExecutionStepScalarWhereInput | ExecutionStepScalarWhereInput[]
  }

  export type ExecutionCreateNestedOneWithoutStepsInput = {
    create?: XOR<ExecutionCreateWithoutStepsInput, ExecutionUncheckedCreateWithoutStepsInput>
    connectOrCreate?: ExecutionCreateOrConnectWithoutStepsInput
    connect?: ExecutionWhereUniqueInput
  }

  export type NodeCreateNestedOneWithoutExecutionStepsInput = {
    create?: XOR<NodeCreateWithoutExecutionStepsInput, NodeUncheckedCreateWithoutExecutionStepsInput>
    connectOrCreate?: NodeCreateOrConnectWithoutExecutionStepsInput
    connect?: NodeWhereUniqueInput
  }

  export type EnumExecutionStepStatusFieldUpdateOperationsInput = {
    set?: $Enums.ExecutionStepStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ExecutionUpdateOneRequiredWithoutStepsNestedInput = {
    create?: XOR<ExecutionCreateWithoutStepsInput, ExecutionUncheckedCreateWithoutStepsInput>
    connectOrCreate?: ExecutionCreateOrConnectWithoutStepsInput
    upsert?: ExecutionUpsertWithoutStepsInput
    connect?: ExecutionWhereUniqueInput
    update?: XOR<XOR<ExecutionUpdateToOneWithWhereWithoutStepsInput, ExecutionUpdateWithoutStepsInput>, ExecutionUncheckedUpdateWithoutStepsInput>
  }

  export type NodeUpdateOneWithoutExecutionStepsNestedInput = {
    create?: XOR<NodeCreateWithoutExecutionStepsInput, NodeUncheckedCreateWithoutExecutionStepsInput>
    connectOrCreate?: NodeCreateOrConnectWithoutExecutionStepsInput
    upsert?: NodeUpsertWithoutExecutionStepsInput
    disconnect?: NodeWhereInput | boolean
    delete?: NodeWhereInput | boolean
    connect?: NodeWhereUniqueInput
    update?: XOR<XOR<NodeUpdateToOneWithWhereWithoutExecutionStepsInput, NodeUpdateWithoutExecutionStepsInput>, NodeUncheckedUpdateWithoutExecutionStepsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumNodeTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeType | EnumNodeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeTypeFilter<$PrismaModel> | $Enums.NodeType
  }

  export type NestedEnumNodeTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeType | EnumNodeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeTypeWithAggregatesFilter<$PrismaModel> | $Enums.NodeType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNodeTypeFilter<$PrismaModel>
    _max?: NestedEnumNodeTypeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumCredentialProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.CredentialProvider | EnumCredentialProviderFieldRefInput<$PrismaModel>
    in?: $Enums.CredentialProvider[] | ListEnumCredentialProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.CredentialProvider[] | ListEnumCredentialProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumCredentialProviderFilter<$PrismaModel> | $Enums.CredentialProvider
  }

  export type NestedEnumCredentialProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CredentialProvider | EnumCredentialProviderFieldRefInput<$PrismaModel>
    in?: $Enums.CredentialProvider[] | ListEnumCredentialProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.CredentialProvider[] | ListEnumCredentialProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumCredentialProviderWithAggregatesFilter<$PrismaModel> | $Enums.CredentialProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCredentialProviderFilter<$PrismaModel>
    _max?: NestedEnumCredentialProviderFilter<$PrismaModel>
  }

  export type NestedEnumExecutionTriggerTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionTriggerType | EnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionTriggerType[] | ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionTriggerType[] | ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionTriggerTypeFilter<$PrismaModel> | $Enums.ExecutionTriggerType
  }

  export type NestedEnumExecutionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStatus | EnumExecutionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStatusFilter<$PrismaModel> | $Enums.ExecutionStatus
  }

  export type NestedEnumExecutionTriggerTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionTriggerType | EnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionTriggerType[] | ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionTriggerType[] | ListEnumExecutionTriggerTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionTriggerTypeWithAggregatesFilter<$PrismaModel> | $Enums.ExecutionTriggerType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExecutionTriggerTypeFilter<$PrismaModel>
    _max?: NestedEnumExecutionTriggerTypeFilter<$PrismaModel>
  }

  export type NestedEnumExecutionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStatus | EnumExecutionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExecutionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExecutionStatusFilter<$PrismaModel>
    _max?: NestedEnumExecutionStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumExecutionStepStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStepStatus | EnumExecutionStepStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStepStatus[] | ListEnumExecutionStepStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStepStatus[] | ListEnumExecutionStepStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStepStatusFilter<$PrismaModel> | $Enums.ExecutionStepStatus
  }

  export type NestedEnumExecutionStepStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStepStatus | EnumExecutionStepStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStepStatus[] | ListEnumExecutionStepStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStepStatus[] | ListEnumExecutionStepStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStepStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExecutionStepStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExecutionStepStatusFilter<$PrismaModel>
    _max?: NestedEnumExecutionStepStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SessionCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowCreateWithoutUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    nodes?: NodeCreateNestedManyWithoutWorkflowInput
    connections?: ConnectionCreateNestedManyWithoutWorkflowInput
    executions?: ExecutionCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    nodes?: NodeUncheckedCreateNestedManyWithoutWorkflowInput
    connections?: ConnectionUncheckedCreateNestedManyWithoutWorkflowInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutUserInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput>
  }

  export type WorkflowCreateManyUserInputEnvelope = {
    data: WorkflowCreateManyUserInput | WorkflowCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CredentialCreateWithoutUserInput = {
    id?: string
    name: string
    provider: $Enums.CredentialProvider
    description?: string | null
    encryptedData: string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CredentialUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    provider: $Enums.CredentialProvider
    description?: string | null
    encryptedData: string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CredentialCreateOrConnectWithoutUserInput = {
    where: CredentialWhereUniqueInput
    create: XOR<CredentialCreateWithoutUserInput, CredentialUncheckedCreateWithoutUserInput>
  }

  export type CredentialCreateManyUserInputEnvelope = {
    data: CredentialCreateManyUserInput | CredentialCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ExecutionCreateWithoutTriggeredByUserInput = {
    id?: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutExecutionsInput
    steps?: ExecutionStepCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionUncheckedCreateWithoutTriggeredByUserInput = {
    id?: string
    workflowId: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: ExecutionStepUncheckedCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionCreateOrConnectWithoutTriggeredByUserInput = {
    where: ExecutionWhereUniqueInput
    create: XOR<ExecutionCreateWithoutTriggeredByUserInput, ExecutionUncheckedCreateWithoutTriggeredByUserInput>
  }

  export type ExecutionCreateManyTriggeredByUserInputEnvelope = {
    data: ExecutionCreateManyTriggeredByUserInput | ExecutionCreateManyTriggeredByUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type WorkflowUpsertWithWhereUniqueWithoutUserInput = {
    where: WorkflowWhereUniqueInput
    update: XOR<WorkflowUpdateWithoutUserInput, WorkflowUncheckedUpdateWithoutUserInput>
    create: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput>
  }

  export type WorkflowUpdateWithWhereUniqueWithoutUserInput = {
    where: WorkflowWhereUniqueInput
    data: XOR<WorkflowUpdateWithoutUserInput, WorkflowUncheckedUpdateWithoutUserInput>
  }

  export type WorkflowUpdateManyWithWhereWithoutUserInput = {
    where: WorkflowScalarWhereInput
    data: XOR<WorkflowUpdateManyMutationInput, WorkflowUncheckedUpdateManyWithoutUserInput>
  }

  export type WorkflowScalarWhereInput = {
    AND?: WorkflowScalarWhereInput | WorkflowScalarWhereInput[]
    OR?: WorkflowScalarWhereInput[]
    NOT?: WorkflowScalarWhereInput | WorkflowScalarWhereInput[]
    id?: StringFilter<"Workflow"> | string
    name?: StringFilter<"Workflow"> | string
    createdAt?: DateTimeFilter<"Workflow"> | Date | string
    updatedAt?: DateTimeFilter<"Workflow"> | Date | string
    userId?: StringFilter<"Workflow"> | string
  }

  export type CredentialUpsertWithWhereUniqueWithoutUserInput = {
    where: CredentialWhereUniqueInput
    update: XOR<CredentialUpdateWithoutUserInput, CredentialUncheckedUpdateWithoutUserInput>
    create: XOR<CredentialCreateWithoutUserInput, CredentialUncheckedCreateWithoutUserInput>
  }

  export type CredentialUpdateWithWhereUniqueWithoutUserInput = {
    where: CredentialWhereUniqueInput
    data: XOR<CredentialUpdateWithoutUserInput, CredentialUncheckedUpdateWithoutUserInput>
  }

  export type CredentialUpdateManyWithWhereWithoutUserInput = {
    where: CredentialScalarWhereInput
    data: XOR<CredentialUpdateManyMutationInput, CredentialUncheckedUpdateManyWithoutUserInput>
  }

  export type CredentialScalarWhereInput = {
    AND?: CredentialScalarWhereInput | CredentialScalarWhereInput[]
    OR?: CredentialScalarWhereInput[]
    NOT?: CredentialScalarWhereInput | CredentialScalarWhereInput[]
    id?: StringFilter<"Credential"> | string
    userId?: StringFilter<"Credential"> | string
    name?: StringFilter<"Credential"> | string
    provider?: EnumCredentialProviderFilter<"Credential"> | $Enums.CredentialProvider
    description?: StringNullableFilter<"Credential"> | string | null
    encryptedData?: StringFilter<"Credential"> | string
    metadata?: JsonFilter<"Credential">
    lastUsedAt?: DateTimeNullableFilter<"Credential"> | Date | string | null
    createdAt?: DateTimeFilter<"Credential"> | Date | string
    updatedAt?: DateTimeFilter<"Credential"> | Date | string
  }

  export type ExecutionUpsertWithWhereUniqueWithoutTriggeredByUserInput = {
    where: ExecutionWhereUniqueInput
    update: XOR<ExecutionUpdateWithoutTriggeredByUserInput, ExecutionUncheckedUpdateWithoutTriggeredByUserInput>
    create: XOR<ExecutionCreateWithoutTriggeredByUserInput, ExecutionUncheckedCreateWithoutTriggeredByUserInput>
  }

  export type ExecutionUpdateWithWhereUniqueWithoutTriggeredByUserInput = {
    where: ExecutionWhereUniqueInput
    data: XOR<ExecutionUpdateWithoutTriggeredByUserInput, ExecutionUncheckedUpdateWithoutTriggeredByUserInput>
  }

  export type ExecutionUpdateManyWithWhereWithoutTriggeredByUserInput = {
    where: ExecutionScalarWhereInput
    data: XOR<ExecutionUpdateManyMutationInput, ExecutionUncheckedUpdateManyWithoutTriggeredByUserInput>
  }

  export type ExecutionScalarWhereInput = {
    AND?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
    OR?: ExecutionScalarWhereInput[]
    NOT?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
    id?: StringFilter<"Execution"> | string
    workflowId?: StringFilter<"Execution"> | string
    triggerType?: EnumExecutionTriggerTypeFilter<"Execution"> | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFilter<"Execution"> | $Enums.ExecutionStatus
    triggeredByUserId?: StringNullableFilter<"Execution"> | string | null
    triggerPayload?: JsonFilter<"Execution">
    state?: JsonFilter<"Execution">
    workflowSnapshot?: JsonNullableFilter<"Execution">
    startedAt?: DateTimeNullableFilter<"Execution"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Execution"> | Date | string | null
    error?: JsonNullableFilter<"Execution">
    createdAt?: DateTimeFilter<"Execution"> | Date | string
    updatedAt?: DateTimeFilter<"Execution"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    workflows?: WorkflowCreateNestedManyWithoutUserInput
    credentials?: CredentialCreateNestedManyWithoutUserInput
    executions?: ExecutionCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    workflows?: WorkflowUncheckedCreateNestedManyWithoutUserInput
    credentials?: CredentialUncheckedCreateNestedManyWithoutUserInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUpdateManyWithoutUserNestedInput
    credentials?: CredentialUpdateManyWithoutUserNestedInput
    executions?: ExecutionUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUncheckedUpdateManyWithoutUserNestedInput
    credentials?: CredentialUncheckedUpdateManyWithoutUserNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    workflows?: WorkflowCreateNestedManyWithoutUserInput
    credentials?: CredentialCreateNestedManyWithoutUserInput
    executions?: ExecutionCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    workflows?: WorkflowUncheckedCreateNestedManyWithoutUserInput
    credentials?: CredentialUncheckedCreateNestedManyWithoutUserInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUpdateManyWithoutUserNestedInput
    credentials?: CredentialUpdateManyWithoutUserNestedInput
    executions?: ExecutionUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUncheckedUpdateManyWithoutUserNestedInput
    credentials?: CredentialUncheckedUpdateManyWithoutUserNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type NodeCreateWithoutWorkflowInput = {
    id?: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromConnections?: ConnectionCreateNestedManyWithoutFromNodeInput
    toConnections?: ConnectionCreateNestedManyWithoutToNodeInput
    executionSteps?: ExecutionStepCreateNestedManyWithoutNodeInput
  }

  export type NodeUncheckedCreateWithoutWorkflowInput = {
    id?: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromConnections?: ConnectionUncheckedCreateNestedManyWithoutFromNodeInput
    toConnections?: ConnectionUncheckedCreateNestedManyWithoutToNodeInput
    executionSteps?: ExecutionStepUncheckedCreateNestedManyWithoutNodeInput
  }

  export type NodeCreateOrConnectWithoutWorkflowInput = {
    where: NodeWhereUniqueInput
    create: XOR<NodeCreateWithoutWorkflowInput, NodeUncheckedCreateWithoutWorkflowInput>
  }

  export type NodeCreateManyWorkflowInputEnvelope = {
    data: NodeCreateManyWorkflowInput | NodeCreateManyWorkflowInput[]
    skipDuplicates?: boolean
  }

  export type ConnectionCreateWithoutWorkflowInput = {
    id?: string
    fromOutput?: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromNode: NodeCreateNestedOneWithoutFromConnectionsInput
    toNode: NodeCreateNestedOneWithoutToConnectionsInput
  }

  export type ConnectionUncheckedCreateWithoutWorkflowInput = {
    id?: string
    fromNodeId: string
    fromOutput?: string
    toNodeId: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionCreateOrConnectWithoutWorkflowInput = {
    where: ConnectionWhereUniqueInput
    create: XOR<ConnectionCreateWithoutWorkflowInput, ConnectionUncheckedCreateWithoutWorkflowInput>
  }

  export type ConnectionCreateManyWorkflowInputEnvelope = {
    data: ConnectionCreateManyWorkflowInput | ConnectionCreateManyWorkflowInput[]
    skipDuplicates?: boolean
  }

  export type ExecutionCreateWithoutWorkflowInput = {
    id?: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    triggeredByUser?: UserCreateNestedOneWithoutExecutionsInput
    steps?: ExecutionStepCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionUncheckedCreateWithoutWorkflowInput = {
    id?: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggeredByUserId?: string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: ExecutionStepUncheckedCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionCreateOrConnectWithoutWorkflowInput = {
    where: ExecutionWhereUniqueInput
    create: XOR<ExecutionCreateWithoutWorkflowInput, ExecutionUncheckedCreateWithoutWorkflowInput>
  }

  export type ExecutionCreateManyWorkflowInputEnvelope = {
    data: ExecutionCreateManyWorkflowInput | ExecutionCreateManyWorkflowInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutWorkflowsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    credentials?: CredentialCreateNestedManyWithoutUserInput
    executions?: ExecutionCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserUncheckedCreateWithoutWorkflowsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    credentials?: CredentialUncheckedCreateNestedManyWithoutUserInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserCreateOrConnectWithoutWorkflowsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWorkflowsInput, UserUncheckedCreateWithoutWorkflowsInput>
  }

  export type NodeUpsertWithWhereUniqueWithoutWorkflowInput = {
    where: NodeWhereUniqueInput
    update: XOR<NodeUpdateWithoutWorkflowInput, NodeUncheckedUpdateWithoutWorkflowInput>
    create: XOR<NodeCreateWithoutWorkflowInput, NodeUncheckedCreateWithoutWorkflowInput>
  }

  export type NodeUpdateWithWhereUniqueWithoutWorkflowInput = {
    where: NodeWhereUniqueInput
    data: XOR<NodeUpdateWithoutWorkflowInput, NodeUncheckedUpdateWithoutWorkflowInput>
  }

  export type NodeUpdateManyWithWhereWithoutWorkflowInput = {
    where: NodeScalarWhereInput
    data: XOR<NodeUpdateManyMutationInput, NodeUncheckedUpdateManyWithoutWorkflowInput>
  }

  export type NodeScalarWhereInput = {
    AND?: NodeScalarWhereInput | NodeScalarWhereInput[]
    OR?: NodeScalarWhereInput[]
    NOT?: NodeScalarWhereInput | NodeScalarWhereInput[]
    id?: StringFilter<"Node"> | string
    workflowId?: StringFilter<"Node"> | string
    name?: StringFilter<"Node"> | string
    type?: EnumNodeTypeFilter<"Node"> | $Enums.NodeType
    position?: JsonFilter<"Node">
    data?: JsonFilter<"Node">
    createdAt?: DateTimeFilter<"Node"> | Date | string
    updatedAt?: DateTimeFilter<"Node"> | Date | string
  }

  export type ConnectionUpsertWithWhereUniqueWithoutWorkflowInput = {
    where: ConnectionWhereUniqueInput
    update: XOR<ConnectionUpdateWithoutWorkflowInput, ConnectionUncheckedUpdateWithoutWorkflowInput>
    create: XOR<ConnectionCreateWithoutWorkflowInput, ConnectionUncheckedCreateWithoutWorkflowInput>
  }

  export type ConnectionUpdateWithWhereUniqueWithoutWorkflowInput = {
    where: ConnectionWhereUniqueInput
    data: XOR<ConnectionUpdateWithoutWorkflowInput, ConnectionUncheckedUpdateWithoutWorkflowInput>
  }

  export type ConnectionUpdateManyWithWhereWithoutWorkflowInput = {
    where: ConnectionScalarWhereInput
    data: XOR<ConnectionUpdateManyMutationInput, ConnectionUncheckedUpdateManyWithoutWorkflowInput>
  }

  export type ConnectionScalarWhereInput = {
    AND?: ConnectionScalarWhereInput | ConnectionScalarWhereInput[]
    OR?: ConnectionScalarWhereInput[]
    NOT?: ConnectionScalarWhereInput | ConnectionScalarWhereInput[]
    id?: StringFilter<"Connection"> | string
    workflowId?: StringFilter<"Connection"> | string
    fromNodeId?: StringFilter<"Connection"> | string
    fromOutput?: StringFilter<"Connection"> | string
    toNodeId?: StringFilter<"Connection"> | string
    toInput?: StringFilter<"Connection"> | string
    data?: JsonFilter<"Connection">
    createdAt?: DateTimeFilter<"Connection"> | Date | string
    updatedAt?: DateTimeFilter<"Connection"> | Date | string
  }

  export type ExecutionUpsertWithWhereUniqueWithoutWorkflowInput = {
    where: ExecutionWhereUniqueInput
    update: XOR<ExecutionUpdateWithoutWorkflowInput, ExecutionUncheckedUpdateWithoutWorkflowInput>
    create: XOR<ExecutionCreateWithoutWorkflowInput, ExecutionUncheckedCreateWithoutWorkflowInput>
  }

  export type ExecutionUpdateWithWhereUniqueWithoutWorkflowInput = {
    where: ExecutionWhereUniqueInput
    data: XOR<ExecutionUpdateWithoutWorkflowInput, ExecutionUncheckedUpdateWithoutWorkflowInput>
  }

  export type ExecutionUpdateManyWithWhereWithoutWorkflowInput = {
    where: ExecutionScalarWhereInput
    data: XOR<ExecutionUpdateManyMutationInput, ExecutionUncheckedUpdateManyWithoutWorkflowInput>
  }

  export type UserUpsertWithoutWorkflowsInput = {
    update: XOR<UserUpdateWithoutWorkflowsInput, UserUncheckedUpdateWithoutWorkflowsInput>
    create: XOR<UserCreateWithoutWorkflowsInput, UserUncheckedCreateWithoutWorkflowsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWorkflowsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWorkflowsInput, UserUncheckedUpdateWithoutWorkflowsInput>
  }

  export type UserUpdateWithoutWorkflowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    credentials?: CredentialUpdateManyWithoutUserNestedInput
    executions?: ExecutionUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWorkflowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    credentials?: CredentialUncheckedUpdateManyWithoutUserNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type WorkflowCreateWithoutNodesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    connections?: ConnectionCreateNestedManyWithoutWorkflowInput
    executions?: ExecutionCreateNestedManyWithoutWorkflowInput
    user: UserCreateNestedOneWithoutWorkflowsInput
  }

  export type WorkflowUncheckedCreateWithoutNodesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    connections?: ConnectionUncheckedCreateNestedManyWithoutWorkflowInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutNodesInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutNodesInput, WorkflowUncheckedCreateWithoutNodesInput>
  }

  export type ConnectionCreateWithoutFromNodeInput = {
    id?: string
    fromOutput?: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutConnectionsInput
    toNode: NodeCreateNestedOneWithoutToConnectionsInput
  }

  export type ConnectionUncheckedCreateWithoutFromNodeInput = {
    id?: string
    workflowId: string
    fromOutput?: string
    toNodeId: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionCreateOrConnectWithoutFromNodeInput = {
    where: ConnectionWhereUniqueInput
    create: XOR<ConnectionCreateWithoutFromNodeInput, ConnectionUncheckedCreateWithoutFromNodeInput>
  }

  export type ConnectionCreateManyFromNodeInputEnvelope = {
    data: ConnectionCreateManyFromNodeInput | ConnectionCreateManyFromNodeInput[]
    skipDuplicates?: boolean
  }

  export type ConnectionCreateWithoutToNodeInput = {
    id?: string
    fromOutput?: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutConnectionsInput
    fromNode: NodeCreateNestedOneWithoutFromConnectionsInput
  }

  export type ConnectionUncheckedCreateWithoutToNodeInput = {
    id?: string
    workflowId: string
    fromNodeId: string
    fromOutput?: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionCreateOrConnectWithoutToNodeInput = {
    where: ConnectionWhereUniqueInput
    create: XOR<ConnectionCreateWithoutToNodeInput, ConnectionUncheckedCreateWithoutToNodeInput>
  }

  export type ConnectionCreateManyToNodeInputEnvelope = {
    data: ConnectionCreateManyToNodeInput | ConnectionCreateManyToNodeInput[]
    skipDuplicates?: boolean
  }

  export type ExecutionStepCreateWithoutNodeInput = {
    id?: string
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    execution: ExecutionCreateNestedOneWithoutStepsInput
  }

  export type ExecutionStepUncheckedCreateWithoutNodeInput = {
    id?: string
    executionId: string
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionStepCreateOrConnectWithoutNodeInput = {
    where: ExecutionStepWhereUniqueInput
    create: XOR<ExecutionStepCreateWithoutNodeInput, ExecutionStepUncheckedCreateWithoutNodeInput>
  }

  export type ExecutionStepCreateManyNodeInputEnvelope = {
    data: ExecutionStepCreateManyNodeInput | ExecutionStepCreateManyNodeInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowUpsertWithoutNodesInput = {
    update: XOR<WorkflowUpdateWithoutNodesInput, WorkflowUncheckedUpdateWithoutNodesInput>
    create: XOR<WorkflowCreateWithoutNodesInput, WorkflowUncheckedCreateWithoutNodesInput>
    where?: WorkflowWhereInput
  }

  export type WorkflowUpdateToOneWithWhereWithoutNodesInput = {
    where?: WorkflowWhereInput
    data: XOR<WorkflowUpdateWithoutNodesInput, WorkflowUncheckedUpdateWithoutNodesInput>
  }

  export type WorkflowUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    connections?: ConnectionUpdateManyWithoutWorkflowNestedInput
    executions?: ExecutionUpdateManyWithoutWorkflowNestedInput
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    connections?: ConnectionUncheckedUpdateManyWithoutWorkflowNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type ConnectionUpsertWithWhereUniqueWithoutFromNodeInput = {
    where: ConnectionWhereUniqueInput
    update: XOR<ConnectionUpdateWithoutFromNodeInput, ConnectionUncheckedUpdateWithoutFromNodeInput>
    create: XOR<ConnectionCreateWithoutFromNodeInput, ConnectionUncheckedCreateWithoutFromNodeInput>
  }

  export type ConnectionUpdateWithWhereUniqueWithoutFromNodeInput = {
    where: ConnectionWhereUniqueInput
    data: XOR<ConnectionUpdateWithoutFromNodeInput, ConnectionUncheckedUpdateWithoutFromNodeInput>
  }

  export type ConnectionUpdateManyWithWhereWithoutFromNodeInput = {
    where: ConnectionScalarWhereInput
    data: XOR<ConnectionUpdateManyMutationInput, ConnectionUncheckedUpdateManyWithoutFromNodeInput>
  }

  export type ConnectionUpsertWithWhereUniqueWithoutToNodeInput = {
    where: ConnectionWhereUniqueInput
    update: XOR<ConnectionUpdateWithoutToNodeInput, ConnectionUncheckedUpdateWithoutToNodeInput>
    create: XOR<ConnectionCreateWithoutToNodeInput, ConnectionUncheckedCreateWithoutToNodeInput>
  }

  export type ConnectionUpdateWithWhereUniqueWithoutToNodeInput = {
    where: ConnectionWhereUniqueInput
    data: XOR<ConnectionUpdateWithoutToNodeInput, ConnectionUncheckedUpdateWithoutToNodeInput>
  }

  export type ConnectionUpdateManyWithWhereWithoutToNodeInput = {
    where: ConnectionScalarWhereInput
    data: XOR<ConnectionUpdateManyMutationInput, ConnectionUncheckedUpdateManyWithoutToNodeInput>
  }

  export type ExecutionStepUpsertWithWhereUniqueWithoutNodeInput = {
    where: ExecutionStepWhereUniqueInput
    update: XOR<ExecutionStepUpdateWithoutNodeInput, ExecutionStepUncheckedUpdateWithoutNodeInput>
    create: XOR<ExecutionStepCreateWithoutNodeInput, ExecutionStepUncheckedCreateWithoutNodeInput>
  }

  export type ExecutionStepUpdateWithWhereUniqueWithoutNodeInput = {
    where: ExecutionStepWhereUniqueInput
    data: XOR<ExecutionStepUpdateWithoutNodeInput, ExecutionStepUncheckedUpdateWithoutNodeInput>
  }

  export type ExecutionStepUpdateManyWithWhereWithoutNodeInput = {
    where: ExecutionStepScalarWhereInput
    data: XOR<ExecutionStepUpdateManyMutationInput, ExecutionStepUncheckedUpdateManyWithoutNodeInput>
  }

  export type ExecutionStepScalarWhereInput = {
    AND?: ExecutionStepScalarWhereInput | ExecutionStepScalarWhereInput[]
    OR?: ExecutionStepScalarWhereInput[]
    NOT?: ExecutionStepScalarWhereInput | ExecutionStepScalarWhereInput[]
    id?: StringFilter<"ExecutionStep"> | string
    executionId?: StringFilter<"ExecutionStep"> | string
    nodeId?: StringNullableFilter<"ExecutionStep"> | string | null
    nodeName?: StringFilter<"ExecutionStep"> | string
    nodeType?: EnumNodeTypeFilter<"ExecutionStep"> | $Enums.NodeType
    status?: EnumExecutionStepStatusFilter<"ExecutionStep"> | $Enums.ExecutionStepStatus
    position?: IntFilter<"ExecutionStep"> | number
    attempt?: IntFilter<"ExecutionStep"> | number
    input?: JsonFilter<"ExecutionStep">
    output?: JsonNullableFilter<"ExecutionStep">
    error?: JsonNullableFilter<"ExecutionStep">
    startedAt?: DateTimeNullableFilter<"ExecutionStep"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ExecutionStep"> | Date | string | null
    durationMs?: IntNullableFilter<"ExecutionStep"> | number | null
    createdAt?: DateTimeFilter<"ExecutionStep"> | Date | string
    updatedAt?: DateTimeFilter<"ExecutionStep"> | Date | string
  }

  export type WorkflowCreateWithoutConnectionsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    nodes?: NodeCreateNestedManyWithoutWorkflowInput
    executions?: ExecutionCreateNestedManyWithoutWorkflowInput
    user: UserCreateNestedOneWithoutWorkflowsInput
  }

  export type WorkflowUncheckedCreateWithoutConnectionsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    nodes?: NodeUncheckedCreateNestedManyWithoutWorkflowInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutConnectionsInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutConnectionsInput, WorkflowUncheckedCreateWithoutConnectionsInput>
  }

  export type NodeCreateWithoutFromConnectionsInput = {
    id?: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutNodesInput
    toConnections?: ConnectionCreateNestedManyWithoutToNodeInput
    executionSteps?: ExecutionStepCreateNestedManyWithoutNodeInput
  }

  export type NodeUncheckedCreateWithoutFromConnectionsInput = {
    id?: string
    workflowId: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    toConnections?: ConnectionUncheckedCreateNestedManyWithoutToNodeInput
    executionSteps?: ExecutionStepUncheckedCreateNestedManyWithoutNodeInput
  }

  export type NodeCreateOrConnectWithoutFromConnectionsInput = {
    where: NodeWhereUniqueInput
    create: XOR<NodeCreateWithoutFromConnectionsInput, NodeUncheckedCreateWithoutFromConnectionsInput>
  }

  export type NodeCreateWithoutToConnectionsInput = {
    id?: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutNodesInput
    fromConnections?: ConnectionCreateNestedManyWithoutFromNodeInput
    executionSteps?: ExecutionStepCreateNestedManyWithoutNodeInput
  }

  export type NodeUncheckedCreateWithoutToConnectionsInput = {
    id?: string
    workflowId: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromConnections?: ConnectionUncheckedCreateNestedManyWithoutFromNodeInput
    executionSteps?: ExecutionStepUncheckedCreateNestedManyWithoutNodeInput
  }

  export type NodeCreateOrConnectWithoutToConnectionsInput = {
    where: NodeWhereUniqueInput
    create: XOR<NodeCreateWithoutToConnectionsInput, NodeUncheckedCreateWithoutToConnectionsInput>
  }

  export type WorkflowUpsertWithoutConnectionsInput = {
    update: XOR<WorkflowUpdateWithoutConnectionsInput, WorkflowUncheckedUpdateWithoutConnectionsInput>
    create: XOR<WorkflowCreateWithoutConnectionsInput, WorkflowUncheckedCreateWithoutConnectionsInput>
    where?: WorkflowWhereInput
  }

  export type WorkflowUpdateToOneWithWhereWithoutConnectionsInput = {
    where?: WorkflowWhereInput
    data: XOR<WorkflowUpdateWithoutConnectionsInput, WorkflowUncheckedUpdateWithoutConnectionsInput>
  }

  export type WorkflowUpdateWithoutConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nodes?: NodeUpdateManyWithoutWorkflowNestedInput
    executions?: ExecutionUpdateManyWithoutWorkflowNestedInput
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    nodes?: NodeUncheckedUpdateManyWithoutWorkflowNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type NodeUpsertWithoutFromConnectionsInput = {
    update: XOR<NodeUpdateWithoutFromConnectionsInput, NodeUncheckedUpdateWithoutFromConnectionsInput>
    create: XOR<NodeCreateWithoutFromConnectionsInput, NodeUncheckedCreateWithoutFromConnectionsInput>
    where?: NodeWhereInput
  }

  export type NodeUpdateToOneWithWhereWithoutFromConnectionsInput = {
    where?: NodeWhereInput
    data: XOR<NodeUpdateWithoutFromConnectionsInput, NodeUncheckedUpdateWithoutFromConnectionsInput>
  }

  export type NodeUpdateWithoutFromConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
    toConnections?: ConnectionUpdateManyWithoutToNodeNestedInput
    executionSteps?: ExecutionStepUpdateManyWithoutNodeNestedInput
  }

  export type NodeUncheckedUpdateWithoutFromConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    toConnections?: ConnectionUncheckedUpdateManyWithoutToNodeNestedInput
    executionSteps?: ExecutionStepUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type NodeUpsertWithoutToConnectionsInput = {
    update: XOR<NodeUpdateWithoutToConnectionsInput, NodeUncheckedUpdateWithoutToConnectionsInput>
    create: XOR<NodeCreateWithoutToConnectionsInput, NodeUncheckedCreateWithoutToConnectionsInput>
    where?: NodeWhereInput
  }

  export type NodeUpdateToOneWithWhereWithoutToConnectionsInput = {
    where?: NodeWhereInput
    data: XOR<NodeUpdateWithoutToConnectionsInput, NodeUncheckedUpdateWithoutToConnectionsInput>
  }

  export type NodeUpdateWithoutToConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
    fromConnections?: ConnectionUpdateManyWithoutFromNodeNestedInput
    executionSteps?: ExecutionStepUpdateManyWithoutNodeNestedInput
  }

  export type NodeUncheckedUpdateWithoutToConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromConnections?: ConnectionUncheckedUpdateManyWithoutFromNodeNestedInput
    executionSteps?: ExecutionStepUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type UserCreateWithoutCredentialsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    workflows?: WorkflowCreateNestedManyWithoutUserInput
    executions?: ExecutionCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserUncheckedCreateWithoutCredentialsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    workflows?: WorkflowUncheckedCreateNestedManyWithoutUserInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutTriggeredByUserInput
  }

  export type UserCreateOrConnectWithoutCredentialsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCredentialsInput, UserUncheckedCreateWithoutCredentialsInput>
  }

  export type UserUpsertWithoutCredentialsInput = {
    update: XOR<UserUpdateWithoutCredentialsInput, UserUncheckedUpdateWithoutCredentialsInput>
    create: XOR<UserCreateWithoutCredentialsInput, UserUncheckedCreateWithoutCredentialsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCredentialsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCredentialsInput, UserUncheckedUpdateWithoutCredentialsInput>
  }

  export type UserUpdateWithoutCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUpdateManyWithoutUserNestedInput
    executions?: ExecutionUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUncheckedUpdateManyWithoutUserNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutTriggeredByUserNestedInput
  }

  export type WorkflowCreateWithoutExecutionsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    nodes?: NodeCreateNestedManyWithoutWorkflowInput
    connections?: ConnectionCreateNestedManyWithoutWorkflowInput
    user: UserCreateNestedOneWithoutWorkflowsInput
  }

  export type WorkflowUncheckedCreateWithoutExecutionsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    nodes?: NodeUncheckedCreateNestedManyWithoutWorkflowInput
    connections?: ConnectionUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutExecutionsInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutExecutionsInput, WorkflowUncheckedCreateWithoutExecutionsInput>
  }

  export type UserCreateWithoutExecutionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    workflows?: WorkflowCreateNestedManyWithoutUserInput
    credentials?: CredentialCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExecutionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    workflows?: WorkflowUncheckedCreateNestedManyWithoutUserInput
    credentials?: CredentialUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExecutionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExecutionsInput, UserUncheckedCreateWithoutExecutionsInput>
  }

  export type ExecutionStepCreateWithoutExecutionInput = {
    id?: string
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    node?: NodeCreateNestedOneWithoutExecutionStepsInput
  }

  export type ExecutionStepUncheckedCreateWithoutExecutionInput = {
    id?: string
    nodeId?: string | null
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionStepCreateOrConnectWithoutExecutionInput = {
    where: ExecutionStepWhereUniqueInput
    create: XOR<ExecutionStepCreateWithoutExecutionInput, ExecutionStepUncheckedCreateWithoutExecutionInput>
  }

  export type ExecutionStepCreateManyExecutionInputEnvelope = {
    data: ExecutionStepCreateManyExecutionInput | ExecutionStepCreateManyExecutionInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowUpsertWithoutExecutionsInput = {
    update: XOR<WorkflowUpdateWithoutExecutionsInput, WorkflowUncheckedUpdateWithoutExecutionsInput>
    create: XOR<WorkflowCreateWithoutExecutionsInput, WorkflowUncheckedCreateWithoutExecutionsInput>
    where?: WorkflowWhereInput
  }

  export type WorkflowUpdateToOneWithWhereWithoutExecutionsInput = {
    where?: WorkflowWhereInput
    data: XOR<WorkflowUpdateWithoutExecutionsInput, WorkflowUncheckedUpdateWithoutExecutionsInput>
  }

  export type WorkflowUpdateWithoutExecutionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nodes?: NodeUpdateManyWithoutWorkflowNestedInput
    connections?: ConnectionUpdateManyWithoutWorkflowNestedInput
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutExecutionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    nodes?: NodeUncheckedUpdateManyWithoutWorkflowNestedInput
    connections?: ConnectionUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type UserUpsertWithoutExecutionsInput = {
    update: XOR<UserUpdateWithoutExecutionsInput, UserUncheckedUpdateWithoutExecutionsInput>
    create: XOR<UserCreateWithoutExecutionsInput, UserUncheckedCreateWithoutExecutionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExecutionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExecutionsInput, UserUncheckedUpdateWithoutExecutionsInput>
  }

  export type UserUpdateWithoutExecutionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUpdateManyWithoutUserNestedInput
    credentials?: CredentialUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExecutionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    workflows?: WorkflowUncheckedUpdateManyWithoutUserNestedInput
    credentials?: CredentialUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExecutionStepUpsertWithWhereUniqueWithoutExecutionInput = {
    where: ExecutionStepWhereUniqueInput
    update: XOR<ExecutionStepUpdateWithoutExecutionInput, ExecutionStepUncheckedUpdateWithoutExecutionInput>
    create: XOR<ExecutionStepCreateWithoutExecutionInput, ExecutionStepUncheckedCreateWithoutExecutionInput>
  }

  export type ExecutionStepUpdateWithWhereUniqueWithoutExecutionInput = {
    where: ExecutionStepWhereUniqueInput
    data: XOR<ExecutionStepUpdateWithoutExecutionInput, ExecutionStepUncheckedUpdateWithoutExecutionInput>
  }

  export type ExecutionStepUpdateManyWithWhereWithoutExecutionInput = {
    where: ExecutionStepScalarWhereInput
    data: XOR<ExecutionStepUpdateManyMutationInput, ExecutionStepUncheckedUpdateManyWithoutExecutionInput>
  }

  export type ExecutionCreateWithoutStepsInput = {
    id?: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutExecutionsInput
    triggeredByUser?: UserCreateNestedOneWithoutExecutionsInput
  }

  export type ExecutionUncheckedCreateWithoutStepsInput = {
    id?: string
    workflowId: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggeredByUserId?: string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionCreateOrConnectWithoutStepsInput = {
    where: ExecutionWhereUniqueInput
    create: XOR<ExecutionCreateWithoutStepsInput, ExecutionUncheckedCreateWithoutStepsInput>
  }

  export type NodeCreateWithoutExecutionStepsInput = {
    id?: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutNodesInput
    fromConnections?: ConnectionCreateNestedManyWithoutFromNodeInput
    toConnections?: ConnectionCreateNestedManyWithoutToNodeInput
  }

  export type NodeUncheckedCreateWithoutExecutionStepsInput = {
    id?: string
    workflowId: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromConnections?: ConnectionUncheckedCreateNestedManyWithoutFromNodeInput
    toConnections?: ConnectionUncheckedCreateNestedManyWithoutToNodeInput
  }

  export type NodeCreateOrConnectWithoutExecutionStepsInput = {
    where: NodeWhereUniqueInput
    create: XOR<NodeCreateWithoutExecutionStepsInput, NodeUncheckedCreateWithoutExecutionStepsInput>
  }

  export type ExecutionUpsertWithoutStepsInput = {
    update: XOR<ExecutionUpdateWithoutStepsInput, ExecutionUncheckedUpdateWithoutStepsInput>
    create: XOR<ExecutionCreateWithoutStepsInput, ExecutionUncheckedCreateWithoutStepsInput>
    where?: ExecutionWhereInput
  }

  export type ExecutionUpdateToOneWithWhereWithoutStepsInput = {
    where?: ExecutionWhereInput
    data: XOR<ExecutionUpdateWithoutStepsInput, ExecutionUncheckedUpdateWithoutStepsInput>
  }

  export type ExecutionUpdateWithoutStepsInput = {
    id?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutExecutionsNestedInput
    triggeredByUser?: UserUpdateOneWithoutExecutionsNestedInput
  }

  export type ExecutionUncheckedUpdateWithoutStepsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NodeUpsertWithoutExecutionStepsInput = {
    update: XOR<NodeUpdateWithoutExecutionStepsInput, NodeUncheckedUpdateWithoutExecutionStepsInput>
    create: XOR<NodeCreateWithoutExecutionStepsInput, NodeUncheckedCreateWithoutExecutionStepsInput>
    where?: NodeWhereInput
  }

  export type NodeUpdateToOneWithWhereWithoutExecutionStepsInput = {
    where?: NodeWhereInput
    data: XOR<NodeUpdateWithoutExecutionStepsInput, NodeUncheckedUpdateWithoutExecutionStepsInput>
  }

  export type NodeUpdateWithoutExecutionStepsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
    fromConnections?: ConnectionUpdateManyWithoutFromNodeNestedInput
    toConnections?: ConnectionUpdateManyWithoutToNodeNestedInput
  }

  export type NodeUncheckedUpdateWithoutExecutionStepsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromConnections?: ConnectionUncheckedUpdateManyWithoutFromNodeNestedInput
    toConnections?: ConnectionUncheckedUpdateManyWithoutToNodeNestedInput
  }

  export type SessionCreateManyUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AccountCreateManyUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkflowCreateManyUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CredentialCreateManyUserInput = {
    id?: string
    name: string
    provider: $Enums.CredentialProvider
    description?: string | null
    encryptedData: string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionCreateManyTriggeredByUserInput = {
    id?: string
    workflowId: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nodes?: NodeUpdateManyWithoutWorkflowNestedInput
    connections?: ConnectionUpdateManyWithoutWorkflowNestedInput
    executions?: ExecutionUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nodes?: NodeUncheckedUpdateManyWithoutWorkflowNestedInput
    connections?: ConnectionUncheckedUpdateManyWithoutWorkflowNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredentialUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: EnumCredentialProviderFieldUpdateOperationsInput | $Enums.CredentialProvider
    description?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredentialUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: EnumCredentialProviderFieldUpdateOperationsInput | $Enums.CredentialProvider
    description?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredentialUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: EnumCredentialProviderFieldUpdateOperationsInput | $Enums.CredentialProvider
    description?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionUpdateWithoutTriggeredByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutExecutionsNestedInput
    steps?: ExecutionStepUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionUncheckedUpdateWithoutTriggeredByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: ExecutionStepUncheckedUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionUncheckedUpdateManyWithoutTriggeredByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NodeCreateManyWorkflowInput = {
    id?: string
    name: string
    type: $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionCreateManyWorkflowInput = {
    id?: string
    fromNodeId: string
    fromOutput?: string
    toNodeId: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionCreateManyWorkflowInput = {
    id?: string
    triggerType: $Enums.ExecutionTriggerType
    status?: $Enums.ExecutionStatus
    triggeredByUserId?: string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NodeUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromConnections?: ConnectionUpdateManyWithoutFromNodeNestedInput
    toConnections?: ConnectionUpdateManyWithoutToNodeNestedInput
    executionSteps?: ExecutionStepUpdateManyWithoutNodeNestedInput
  }

  export type NodeUncheckedUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromConnections?: ConnectionUncheckedUpdateManyWithoutFromNodeNestedInput
    toConnections?: ConnectionUncheckedUpdateManyWithoutToNodeNestedInput
    executionSteps?: ExecutionStepUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type NodeUncheckedUpdateManyWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    position?: JsonNullValueInput | InputJsonValue
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromNode?: NodeUpdateOneRequiredWithoutFromConnectionsNestedInput
    toNode?: NodeUpdateOneRequiredWithoutToConnectionsNestedInput
  }

  export type ConnectionUncheckedUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionUncheckedUpdateManyWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredByUser?: UserUpdateOneWithoutExecutionsNestedInput
    steps?: ExecutionStepUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionUncheckedUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: ExecutionStepUncheckedUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionUncheckedUpdateManyWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    triggerType?: EnumExecutionTriggerTypeFieldUpdateOperationsInput | $Enums.ExecutionTriggerType
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    triggeredByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    triggerPayload?: JsonNullValueInput | InputJsonValue
    state?: JsonNullValueInput | InputJsonValue
    workflowSnapshot?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionCreateManyFromNodeInput = {
    id?: string
    workflowId: string
    fromOutput?: string
    toNodeId: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionCreateManyToNodeInput = {
    id?: string
    workflowId: string
    fromNodeId: string
    fromOutput?: string
    toInput?: string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionStepCreateManyNodeInput = {
    id?: string
    executionId: string
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionUpdateWithoutFromNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutConnectionsNestedInput
    toNode?: NodeUpdateOneRequiredWithoutToConnectionsNestedInput
  }

  export type ConnectionUncheckedUpdateWithoutFromNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionUncheckedUpdateManyWithoutFromNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionUpdateWithoutToNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutConnectionsNestedInput
    fromNode?: NodeUpdateOneRequiredWithoutFromConnectionsNestedInput
  }

  export type ConnectionUncheckedUpdateWithoutToNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionUncheckedUpdateManyWithoutToNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    fromOutput?: StringFieldUpdateOperationsInput | string
    toInput?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionStepUpdateWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    execution?: ExecutionUpdateOneRequiredWithoutStepsNestedInput
  }

  export type ExecutionStepUncheckedUpdateWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    executionId?: StringFieldUpdateOperationsInput | string
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionStepUncheckedUpdateManyWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    executionId?: StringFieldUpdateOperationsInput | string
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionStepCreateManyExecutionInput = {
    id?: string
    nodeId?: string | null
    nodeName: string
    nodeType: $Enums.NodeType
    status?: $Enums.ExecutionStepStatus
    position: number
    attempt?: number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    durationMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExecutionStepUpdateWithoutExecutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    node?: NodeUpdateOneWithoutExecutionStepsNestedInput
  }

  export type ExecutionStepUncheckedUpdateWithoutExecutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionStepUncheckedUpdateManyWithoutExecutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    nodeName?: StringFieldUpdateOperationsInput | string
    nodeType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    status?: EnumExecutionStepStatusFieldUpdateOperationsInput | $Enums.ExecutionStepStatus
    position?: IntFieldUpdateOperationsInput | number
    attempt?: IntFieldUpdateOperationsInput | number
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}