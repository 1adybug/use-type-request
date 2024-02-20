import useSWR from "swr"
import { PublicConfiguration, Revalidator, RevalidatorOptions, SWRResponse } from "swr/_internal"
import { AvailableMethod, AvailableRequest, DataOrDataFn, DefaultRequestMap, GetResult, InitRequestConfigWithInterceptor, InputRequestConfigWithInterceptor, Keyof, TypeRequest, getConfig, getResult } from "type-request"

/** UseSWTR 的选项 */
export type UseSWTROptions<RequestMap extends DefaultRequestMap, Url extends Keyof<RequestMap>, Method extends AvailableMethod<RequestMap, Url> | undefined = undefined, Data extends AvailableRequest<RequestMap, Url, Method>["result"] = AvailableRequest<RequestMap, Url, Method>["result"]> = Omit<PublicConfiguration<Data, any, any>, "fetcher" | "onLoadingSlow" | "onSuccess" | "onError" | "onErrorRetry"> & {
    fetcher?: GetResult
    onLoadingSlow: (key: string, config: Readonly<UseSWTROptions<RequestMap, Url, Method>>) => void
    onSuccess: (data: Data, key: string, config: Readonly<UseSWTROptions<RequestMap, Url, Method>>) => void
    onError: (err: Error, key: string, config: Readonly<UseSWTROptions<RequestMap, Url, Method>>) => void
    onErrorRetry: (err: Error, key: string, config: Readonly<UseSWTROptions<RequestMap, Url, Method>>, revalidate: Revalidator, revalidateOpts: Required<RevalidatorOptions>) => void
}

/** UseSWTR 函数的类型 */
export type UseSWTR<RequestMap extends DefaultRequestMap> = <Url extends Keyof<RequestMap>, Method extends AvailableMethod<RequestMap, Url> | undefined = undefined>(config: DataOrDataFn<InputRequestConfigWithInterceptor<RequestMap, Url, Method>>, options?: UseSWTROptions<RequestMap, Url, Method>) => SWRResponse<AvailableRequest<RequestMap, Url, Method>["result"], Error, UseSWTROptions<RequestMap, Url, Method>>

/**
 * 像 createTypeRequest 一样创建 UseSWTR
 * @param initConfig 默认配置或者生成默认配置的函数
 */
export function createUseSWTR<RequestMap extends DefaultRequestMap>(initConfig?: DataOrDataFn<InitRequestConfigWithInterceptor>): UseSWTR<RequestMap> {
    return function useSWTR(config, options) {
        const finalConfig = getConfig(config, initConfig)
        return useSWR(finalConfig, getResult, options)
    }
}

/**
 * 直接将 request 函数传入创建 UseSWTR
 * @param request 由 createRequest 生成的 request 函数
 */
export function createUseSWTRWithRequest<RequestMap extends DefaultRequestMap>(request: TypeRequest<RequestMap>): UseSWTR<RequestMap> {
    return function useSWTR(config, options) {
        const finalConfig = request.getConfig(config)
        return useSWR(finalConfig, getResult, options)
    }
}

export default createUseSWTR
