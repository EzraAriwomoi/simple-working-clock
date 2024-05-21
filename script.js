window.addEventListener("DOMContentLoaded",() => {
    const c = new Clock11(".clock");
});

class Clock11{
    constructor(el){
        this.el = document.querySelector(el);

        this.init();
    }
    init(){
        this.timeUpdate();
    }
    get timeAsObject(){
        const date = new Date();
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();

        return { h, m, s };
    }
    get timeAsString(){
        const [h,m,s,ap] = this.timeDigitsGrouped;

        return `${h}:${m}:${s} ${ap}`;
    }
    get timeDigitsGrouped(){
        let { h, m, s } = this.timeAsObject;
        const ap = h > 11 ? "PM" : "AM";
        if (h === 0) h += 12;
        else if (h > 12) h -= 12;
        if (m < 10) m = `0${m}`;
        if (s < 10) s = `0${s}`;

        return [h,m,s,ap];
    }
    animateHand(hand){
        const time = this.timeAsObject;
        const minFraction = time.s / 60;
        const angleB = Utils.decPlaces(360 * minFraction,3);
        const angleA = angleB - 6;
        
        this.el?.querySelector(`[data-hand="${hand}"]`)?.animate(
            [
                { transform: `rotate(${angleA}deg) translateY(-0.5em)` },
                { transform: `rotate(${angleB}deg) translateY(-0.5em)` },
            ],
            { duration: 300, easing: "cubic-bezier(0.77,0,0.18,1)" }
            );
    }
    timeUpdate(){
        this.el?.setAttribute("aria-label", this.timeAsString);
        const time = this.timeAsObject;
        const minFraction = time.s / 60;
        const hrFraction = (time.m + minFraction) / 60;
        const twelveHrFraction = (time.h + hrFraction) / 12;

        this.el?.style.setProperty("--secAngle",`${Utils.decPlaces(360 * minFraction,3)}deg`)
        this.el?.style.setProperty("--minAngle",`${Utils.decPlaces(360 * hrFraction,3)}deg`)
        this.el?.style.setProperty("--hrAngle",`${Utils.decPlaces(360 * twelveHrFraction,3)}deg`)

        this.animateHand("s");
        clearTimeout(this.timeUpdateLoop);
        this.timeUpdateLoop = setTimeout(this.timeUpdate.bind(this),1e3);
    }
}
class Utils{
    static decPlaces(n,d){
        return Math.round(n * 10 ** d) / 10 ** d;
    }
}