import color from "colors";

export class Logs {
    public success(message: string) {
        console.log(`${color.green("[#]")} ${color.gray(message)}`);
    }

    public info(message: string) {
        console.log(`${color.yellow("[*]")} ${color.gray(message)}`);
    }
    
    public error(message: string) {
        console.log(`${color.red("[!]")} ${color.gray(message)}`);
    }
}