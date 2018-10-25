var moment = require('moment');

module.exports = class WatchQueue {
    constructor(debounceDelay = 2000) {

        this.tasks = [];
        this.paused = false;
        this.timeout = 0;
        this.sleep = debounceDelay;
        this.debounceDelay = debounceDelay;
        this.pendingRequests = 0;

        this._flush = this._flush.bind(this);
    }

    pause = (ms) => {
        this.sleep = ms;
        this.paused = true
        this.timeout = setTimeout(() => {
            this.paused = false
            this._flush()
            this.pendingRequests = 0;
            this.timeout = null;
        }, ms)
    }
    continue = () => this.paused = false;

    queue = (data, cb) => {
        if(this.timeout){
            clearTimeout(this.timeout)
        }
        this.pendingRequests += 1;
        if(this.pendingRequests > 2)
            this.pause(5000)
        else
            this.pause(500);
        if (this.tasks.filter(i => i.name == data.name).length > 0) {
            let task = this.tasks.filter(i => i.name == data.name)[0]
            task.ready = true;
        } else {
            this.tasks.push({
                name: data.name,
                cb: cb,
                ready: true,
                lastRun: 0
            })
        }
    }

    _flush = () => {
        this.tasks.forEach((task, idx) => {
            if (task.ready && !this.paused) {
                this._run(task);
            }
        })
    }
    
    _run = (task) => {
        if(!this.paused){
            task.ready = false;
            task.lastRun = moment.now()
            task.cb(task)
        }
    }
}