<template src="./view.html"></template>
<style src="./view.scss" lang="sass"></style>
<script>
import 'whatwg-fetch';
var format = require('date-fns/format')
var addMilliseconds = require('date-fns/add_milliseconds')
export default {
    data() {
        return {
            tz: '0',
            tzoffset: 0,
            sqrew: 0,
            fmt: 'time',
            time: '',
            syncing: false,
            error_text: '',
            toasts: [],
            servers: [],
            sync_count: 5,
            local_tzoffset: new Date().getTimezoneOffset() * 60000,
            style: {},
            debug: false,
            timeStarted: Date.now(),
            countDownTime: null,
        }
    },
    created () {
        this.servers = process.env.config.servers;
        this.debug = process.env.NODE_ENV === 'debug';
        this.sync_countc = process.env.config.sync_count;
        this.setParams();
        let style = '';
        for (var key in this.style) {
            if (this.style[key] !== true) {
                style += `${key}=${this.style[key]};`;
            }
            else {
                style += `${key};`;
            }
        }

        if (style.length > 0) {
            if (this.$route.name === 'timer') {
                this.$router.replace({name: 'timer-with-style', params: {style: style}});
            } else if (this.$route.name === 'countdown') {
                this.$router.replace({name: 'countdown-with-style', params: {time: this.countDownTime, fmt: this.fmt, tz: this.tz, style: style}});
            } else {
                this.$router.replace({name: 'app-with-style', params: {fmt: this.fmt, tz: this.tz, style: style}});
            }
        }
        else if (this.$route.name === null || this.$route.name === undefined) {
            this.$router.replace({name: 'app', params: {fmt: this.fmt, tz: this.tz}});
        }
        this.drawTime();
        if (this.$route.name === 'app' || this.$route.name === 'app-with-style' || this.$route.name === 'countdown' || this.$route.name === 'countdown-with-style') {
            this.syncTime();
        }

        if (this.$route.name === 'timer' || this.$route.name === 'timer-with-style') {
            this.timeStarted = Date.now();
        }
    },
    watch: {
        '$route': 'setParams'
    },
    methods: {
        getTZOffset(str)
        {
            switch (str) {
                case "-1200": {return 3600000 * -12; }
                case "-1100": {return 3600000 * -11; }
                case "-1000": {return 3600000 * -10; }
                case "-0930": {return 3600000 * -9.5; }
                case "-0900": {return 3600000 * -9; }
                case "-0800": {return 3600000 * -8; }
                case "-0700": {return 3600000 * -7; }
                case "-0600": {return 3600000 * -6; }
                case "-0500": {return 3600000 * -5; }
                case "-0400": {return 3600000 * -4; }
                case "-0330": {return 3600000 * -3.5; }
                case "-0300": {return 3600000 * -3; }
                case "-0200": {return 3600000 * -2; }
                case "-0100": {return 3600000 * -1; }
                case "+0100": {return 3600000 * 1; }
                case "+0200": {return 3600000 * 2; }
                case "+0300": {return 3600000 * 3; }
                case "+0330": {return 3600000 * 3.5; }
                case "+0400": {return 3600000 * 4; }
                case "+0430": {return 3600000 * 4.5; }
                case "+0500": {return 3600000 * 5; }
                case "+0530": {return 3600000 * 5.5; }
                case "+0545": {return 3600000 * 5.75; }
                case "+0600": {return 3600000 * 6; }
                case "+0630": {return 3600000 * 6.5; }
                case "+0700": {return 3600000 * 7; }
                case "+0800": {return 3600000 * 8; }
                case "+0830": {return 3600000 * 8.5; }
                case "+0845": {return 3600000 * 8.75; }
                case "+0900": {return 3600000 * 9; }
                case "+0930": {return 3600000 * 9.5; }
                case "+1000": {return 3600000 * 10; }
                case "+1030": {return 3600000 * 10.5; }
                case "+1100": {return 3600000 * 11; }
                case "+1200": {return 3600000 * 12; }
                case "+1245": {return 3600000 * 12.75; }
                case "+1300": {return 3600000 * 13; }
                case "+1400": {return 3600000 * 14; }
                default:  { return 0; }
            }
        },

        getTZ(offset)
        {
            switch (offset) {
                case 3600000 * -12: {return "-1200"}
                case 3600000 * -11: {return "-1100"}
                case 3600000 * -10: {return "-1000"}
                case 3600000 * -9.5: {return "-0930"}
                case 3600000 * -9: {return "-0900"}
                case 3600000 * -8: {return "-0800"}
                case 3600000 * -7: {return "-0700"}
                case 3600000 * -6: {return "-0600"}
                case 3600000 * -5: {return "-0500"}
                case 3600000 * -4: {return "-0400"}
                case 3600000 * -3.5: {return "-0330"}
                case 3600000 * -3: {return "-0300"}
                case 3600000 * -2: {return "-0200"}
                case 3600000 * -1: {return "-0100"}
                case 3600000 * 1: {return "+0100"}
                case 3600000 * 2: {return "+0200"}
                case 3600000 * 3: {return "+0300"}
                case 3600000 * 3.5: {return "+0330"}
                case 3600000 * 4: {return "+0400"}
                case 3600000 * 4.5: {return "+0430"}
                case 3600000 * 5: {return "+0500"}
                case 3600000 * 5.5: {return "+0530"}
                case 3600000 * 5.75: {return "+0545"}
                case 3600000 * 6: {return "+0600"}
                case 3600000 * 6.5: {return "+0630"}
                case 3600000 * 7: {return "+0700"}
                case 3600000 * 8: {return "+0800"}
                case 3600000 * 8.5: {return "+0830"}
                case 3600000 * 8.75: {return "+0845"}
                case 3600000 * 9: {return "+0900"}
                case 3600000 * 9.5: {return "+0930"}
                case 3600000 * 10: {return "+1000"}
                case 3600000 * 10.5: {return "+1030"}
                case 3600000 * 11: {return "+1100"}
                case 3600000 * 12: {return "+1200"}
                case 3600000 * 12.75: {return "+1245"}
                case 3600000 * 13: {return "+1300"}
                case 3600000 * 14: {return "+1400"}
                default:  { return "+0000"; }
            }
        },

        setParams () {
            if (this.$route.params.tz !== undefined) {
                this.tz = this.$route.params.tz;
                this.tzoffset = this.getTZOffset(this.$route.params.tz);
            }
            else {
                this.tzoffset = this.local_tzoffset * -1;
                this.tz = this.getTZ(this.tzoffset);
            }
            if (this.$route.params.fmt !== undefined) {
                this.fmt = this.$route.params.fmt;
            }
            if (this.$route.params.style !== undefined) {
                // parse style
                let pairs = this.$route.params.style.match(/([\w=]*);?/g);
                if (pairs !== null) {
                    //let style = {};
                    for (var i = 0; i < pairs.length; i++) {
                        let keyValuePair = pairs[i].match(/(\w*)(=(\w*))?;?/);
                        if (keyValuePair !== null && keyValuePair[1] !== null && keyValuePair[1].length > 0) {
                            if (keyValuePair.length === 4 && keyValuePair[3] !== undefined) {
                                this.style[keyValuePair[1]] = keyValuePair[3];
                            }
                            else {
                                this.style[keyValuePair[1]] = true;
                            }
                        }
                    }
                }
            }
            if (this.$route.params.time !== undefined) {
                let t = parseInt(this.$route.params.time);
                if (isNaN(t)) {
                    console.error(`${this.$route.params.time} is not a number`)
                    return
                }
                this.countDownTime = new Date(t);
            }
        },

getColor(c, def) {
            if (c === undefined || c === null) {
                if (def === null || def === undefined) {
                    return "inherit";
                }
                return def;
            }
            c = c.toString();
            if (c.substr(0, 1) !== '#') {
                return '#' + c;
            }
            return c;
        },
        drawTime() {
            if (this.$route.name === 'app' || this.$route.name === 'app-with-style') {
                let ut = new Date(Date.now() + this.sqrew + this.tzoffset + this.local_tzoffset);
                switch (this.fmt) {
                    case 'time': {
                        let h,m,s;
                        h=ut.getHours();
                        m=ut.getMinutes();
                        s=ut.getSeconds();
                        if(s<=9) s="0"+s;
                        if(m<=9) m="0"+m;
                        if(h<=9) h="0"+h;
                        this.time = h+":"+m+":"+s;
                        break;
                    }
                    case 'unix': {
                        this.time = `${Math.floor(ut.getTime() / 1000)}`;
                        break;
                    }
                    case 'date': {
                        let h,m,s;
                        h=ut.getHours();
                        m=ut.getMinutes();
                        s=ut.getSeconds();
                        if(s<=9) s="0"+s;
                        if(m<=9) m="0"+m;
                        if(h<=9) h="0"+h;
                        this.time = ut.getDay() + "." + (ut.getMonth() + 1) + "." + ut.getFullYear() + " " + h + ":" + m + ":" + s;
                        break;
                    }
                    default: {
                        this.time = format(ut, this.fmt);
                    }
                }
            } else if (this.$route.name === 'countdown' || this.$route.name === 'countdown-with-style') {
                let d = this.countDownTime - Date.now() + this.sqrew + this.tzoffset + this.local_tzoffset;
                let h = Math.floor(d/3600000);
                d = d - h * 3600000;
                let m = Math.floor(d/60000);
                d = d - m * 60000;
                let s = Math.floor(d/1000);
                
                if(s<=9) s="0"+s;
                if(m<=9) m="0"+m;
                if(h<=9) h="0"+h;
                this.time = h + ":" + m + ":" + s;
            } else { // if timer
                let d = Date.now() - this.timeStarted;
                let h = Math.floor(d/3600000);
                d = d - h * 3600000;
                let m = Math.floor(d/60000);
                d = d - m * 60000;
                let s = Math.floor(d/1000);
                
                if(s<=9) s="0"+s;
                if(m<=9) m="0"+m;
                if(h<=9) h="0"+h;
                this.time = h + ":" + m + ":" + s;
            }
            document.title = this.time + " - atom.watch";
            setTimeout(this.drawTime, 1000);
        },

        // sync process is like that:
        // 1. Remember current time
        // 2. Get the current server time
        // 3. The current time - the saved time is the total rtt
        //    This means that the server time is +rtt/2 ahead
        // 4. So set the time to ServerTime + rtt/2
        // To get a better rtt time we fire multiple requests after another
        syncTime() {
            if (this.syncing || this.servers.length === 0) {
                return;
            }
            this.syncing = true;
            
            let $this = this;
            let sqrews = [];
            let q = new Promise((resolve, reject) => {
                resolve(null);
            });
            
            let t;

            function addSqrew(server, date) {
                if (date !== null) {
                    let rtt = (Date.now() - t) / 2;
                    console.debug(`${server.url}: rtt is ${rtt}`);
                    console.debug(`sqrew is ${date.getTime()} - ${Date.now()} + ${rtt}`);
                    sqrews.push({
                        rtt: rtt,   
                        sqrew: date.getTime() - Date.now() + rtt,
                        server: server,
                    });
                }
            }

            for (var i = 0; i < $this.servers.length; i++) {
                
                let server = $this.servers[i];

                for (var j = 0; j < this.sync_count; j++) {
                    q = q.then(function() {
                        t = Date.now();
                        return $this.getTimeFromServer(server);
                    })
                    .then(function(date) {
                        addSqrew(server, date);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                }
            }

            q.then(() => {
                if (sqrews.length > 0) {
                    //sort dates
                    sqrews.sort((a, b) => {
                        return a.sqrew > b.sqrew;
                    });

                    console.debug(sqrews);
                    let s = sqrews[Math.floor(sqrews.length / 2)];
                    $this.sqrew = s.sqrew;
                    console.log("took time from " + s.server.url);
                    $this.syncing = false;
                }
                else {
                    $this.error_text = "Unable to sync time!";
                }
            })
           
        },

        getTimeFromServer(server) {
            return new Promise(function(resolve, reject) {
                fetch(server.url, {method: 'GET', cache: "no-cache", headers:{'Accept': 'application/json'}})
                .then((response) => {
                    if (response.status !== 200) {
                        throw response.status;
                    }
                    return response.json();
                })
                .then((response) => {
                    console.debug(`${server.url} responded with ${JSON.stringify(response)}`);
                    if (!response[server.field]) {
                        throw "Invalid format";
                    }
                    console.debug(`${server.url} tzoffset = ${server.tzoffset}`);
                    console.debug(`${server.url} parsing ${server.field} = ${response[server.field]}`);
                    if (server.tzoffset !== undefined && server.tzoffset !== null && server.tzoffset !== 0) {
                        resolve(new Date(new Date(response[server.field]).getTime() + server.tzoffset));
                    }
                    else {
                        resolve(new Date(response[server.field]));
                    }
                })
                .catch((err) => {
                    reject(err);
                });
            });
        },

    }
}
</script>