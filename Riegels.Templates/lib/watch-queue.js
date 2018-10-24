var moment = require('moment');

module.exports = class WatchQueue {
    constructor(debounceDelay = 1000) {

        this.tasks = [];
        this.paused = false;
        this.timeout = 0;
        this.debounceDelay = debounceDelay;

        this._flush = this._flush.bind(this);

        setInterval(() => {
            this._flush()
        }, this.debounceDelay);
    }

    pause = () => this.paused = true
    continue = () => this.paused = false;

    queue = (data, cb) => {
        if (this.tasks.filter(i => i.name == data.name).length > 0) {
            let task = this.tasks.filter(i => i.name == data.name)[0]
            if (!task.ready && ((moment.now() - task.lastRun) > task.sleep)) {
                task.ready = true;
            } else {
                console.log("Ready to fire in:" + (task.sleep - (moment.now() - task.lastRun)) / 1000)
                task.ready = true;
            }
        } else {
            this.tasks.push({
                name: data.name,
                sleep: data.sleep,
                cb: cb,
                ready: true,
                lastRun: 0
            })
        }
    }

    _flush = () => {
        this.tasks.forEach((task, idx) => {
            if (task.ready && !this.paused) {
                if(task.sleep - (moment.now() - task.lastRun) < 0){
                    this._run(task);
                }
            }
        })
    }
    
    _run = (task) => {
        if(this.timeout)
            clearInterval(this.timeout)
        this.timeout = setTimeout(() => {
            if(!this.paused){
                task.ready = false;
                task.lastRun = moment.now()
                task.cb(task)
            }
        }, 1000);
    }
}