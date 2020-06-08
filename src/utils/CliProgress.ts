import cliProgress, { SingleBar, MultiBar } from "cli-progress";

export function singleBar(type: string): SingleBar {
    return new cliProgress.SingleBar({
        format: `${type} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {name}`,
    });
}
export function multiBar(type: string): MultiBar {
    return new cliProgress.MultiBar({
        format: `${type} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {name}`,
    });
}
