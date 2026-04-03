

export class APILogger {

    private recentLogs: any[] = []

    logRequest(method: string, url: string, headers: Record<string, string>, body?: any){
        const logEntry = {method, url, headers, body}
        this.recentLogs.push({type: 'Request Details', data: logEntry})
    }

    logResponse(statusCode: number, body?: any){
        const logEntry = {statusCode, body}
        this.recentLogs.push({type: 'Response Details', data: logEntry})
    }

    getRecentLogs(){
        const logs = this.recentLogs.map(log => { // map é uma função de array que transforma cada elemento do array em algo novo, nesse caso, uma string formatada
            return `===${log.type}===\n${JSON.stringify(log.data, null, 4)}` // JSON.stringify é uma função que transforma um objeto em uma string, o segundo parâmetro é uma função de replacer (que pode ser usada para filtrar ou modificar os valores), e o terceiro parâmetro é o número de espaços para indentação (para deixar a string mais legível)
        }).join('\n\n') // join é uma função de array que junta todos os elementos do array em uma única string, usando o parâmetro como separador
        return logs
    }

}