// export interface UploadRequestOption<T = any> {
//    onProgress?: (event: UploadProgressEvent) => void;
//    onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
//    onSuccess?: (body: T, xhr?: XMLHttpRequest) => void;
//    data?: Record<string, unknown>;
//    filename?: string;
//    file: Exclude<BeforeUploadFileType, File | boolean> | RcFile;
//    withCredentials?: boolean;
//    action: string;
//    headers?: UploadRequestHeader;
//    method: UploadRequestMethod;
// }