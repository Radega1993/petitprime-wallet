import { ErrorType } from '../components/common/ErrorDisplay';

/**
 * Determina el tipo de error basado en el mensaje o código de error
 */
export function getErrorType(error: any): ErrorType {
    if (!error) return 'unknown';

    const errorMessage = error.message || error.toString() || '';
    const errorCode = error.code || error.status || error.statusCode;

    // Token expirado
    if (
        errorMessage.toLowerCase().includes('expirado') ||
        errorMessage.toLowerCase().includes('expired') ||
        errorMessage.toLowerCase().includes('token expirado') ||
        errorCode === 410 // Gone
    ) {
        return 'token_expired';
    }

    // Token ya usado o tarjeta ya existe
    if (
        errorMessage.toLowerCase().includes('ya usado') ||
        errorMessage.toLowerCase().includes('already used') ||
        errorMessage.toLowerCase().includes('ya agregada') ||
        errorMessage.toLowerCase().includes('already added') ||
        errorMessage.toLowerCase().includes('duplicate') ||
        errorCode === 409 // Conflict
    ) {
        return 'token_used';
    }

    // Error de conexión
    if (
        errorMessage.toLowerCase().includes('network request failed') ||
        errorMessage.toLowerCase().includes('failed to fetch') ||
        errorMessage.toLowerCase().includes('no se pudo conectar') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('conexión') ||
        errorMessage.toLowerCase().includes('timeout') ||
        errorCode === 'NETWORK_ERROR' ||
        errorCode === 'ECONNREFUSED'
    ) {
        return 'connection';
    }

    // Error del servidor
    if (
        errorCode >= 500 ||
        errorMessage.toLowerCase().includes('internal server error') ||
        errorMessage.toLowerCase().includes('server error') ||
        errorMessage.toLowerCase().includes('error del servidor')
    ) {
        return 'server';
    }

    // Link inválido
    if (
        errorMessage.toLowerCase().includes('inválido') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('token no encontrado') ||
        errorMessage.toLowerCase().includes('token not found') ||
        errorCode === 404 // Not Found
    ) {
        return 'invalid_link';
    }

    return 'unknown';
}

/**
 * Obtiene un mensaje de error amigable basado en el tipo
 */
export function getErrorMessage(error: any): string {
    const errorType = getErrorType(error);
    const errorMessage = error.message || error.toString() || '';

    switch (errorType) {
        case 'token_expired':
            return 'El link que intentaste usar ha expirado. Solicita un nuevo link desde el email original.';
        case 'token_used':
            return 'Esta tarjeta ya está en tu wallet. Puedes verla en la lista de tarjetas.';
        case 'connection':
            return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        case 'server':
            return 'El servidor no está disponible en este momento. Por favor, intenta más tarde.';
        case 'invalid_link':
            return 'El link que intentaste usar no es válido. Asegúrate de copiar el link completo.';
        default:
            return errorMessage || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
    }
}

