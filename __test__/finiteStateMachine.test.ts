import { StateMachine } from "../src/finiteStateMachine"

test("state machine test", ()=> {

    const sm = StateMachine
                .initial<string, string>(state=>
                    state.state("COIN0").entry(()=>{console.log("entry COIN0")}).exit(()=>console.log("exit COIN0")))
                .with(state=>
                    state.state("COIN5").entry(()=>{console.log("entry COIN5")}).exit(()=>console.log("exit COIN5")))
                .with(state=>
                    state.state("COIN10").entry(()=>{console.log("entry COIN10")}).exit(()=>console.log("exit COIN10")))
                .on(transition=>
                    transition.from("COIN0").to("COIN5").event("INSERT5").action(()=>console.log("5COIN INSERTED")))
                .on(transition=>
                    transition.from("COIN5").to("COIN10").event("INSERT5").action(()=>console.log("5COIN INSERTED")))
                .on(transition=>
                    transition.from("COIN0").to("COIN10").event("INSERT10").action(()=>console.log("10COIN INSERTED")))
                .on(transition=>
                    transition.from("COIN10").to("COIN0").event("PUSH BUTTON").action(()=>console.log("PUSH BUTTON")));

    console.log(sm.state);

    sm.dispatch("INSERT5");

    expect(sm.state).toEqual("COIN5")

    console.log(sm.state);

    sm.dispatch("INSERT5");

    expect(sm.state).toEqual("COIN10")

    console.log(sm.state);

    sm.dispatch("PUSH BUTTON");

    expect(sm.state).toEqual("COIN0");

    console.log(sm.state);

})