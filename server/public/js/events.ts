
export const EventEmitter: {
    events: any,
    dispatch(event: any, data: any): void,
    subscribe(event: any, data: any): void
} = {
    events: {},
    dispatch: function(event: any, data: any) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback: any) => callback(data));
    },
    subscribe: function (event: any, callback: any) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }
}