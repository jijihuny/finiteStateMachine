# Finite State Machine
- Moore's finite state machine에 대한 구현체입니다.
- 빌더 패턴을 사용하면 예쁘고 가독성도 좋을 것 같았는데, 그러지 않아서 한 번 만들어봤습니다.
- 조금씩 다듬어보겠습니다.


# 사용법

```typescript

const sm = StateMachine
                .initial<string, string>(state=>
                    state.state("STATE1").entry(()=>{console.log("entry STATE1")}).exit(()=>console.log("exit STATE1")))
                    // initial을 통해 초기상태를 설정해줍니다.
                    // entry는 상태에 진입하는 시점에 실행할 행동
                    // exit는 상태에서 나가는 시점에 실행할 행동입니다.
                .with(state=>
                    state.state("STATE2").entry(()=>{console.log("entry COIN5")}))
                    // 다른 상태들은 with를 통해 설정할 수 있습니다.
                    // entry와 exit는 꼭 설정하지 않아도 됩니다.
                .with(state=>
                    state.state("STATE3"))
                .on(transition=>
                    transition.from("STATE1").to("STATE2").event("1TO2").action(()=>console.log("1TO2 TRANSITION")))
                    //on을 통해 transition을 설정해줍니다.
                    //event에 따라 from에서 to로 상태 전이 함수가 정의되며, action을 통해 전이할 때 실행할 행동을 설정가능합니다.
                .on(transition=>
                    transition.from("STATE2").to("STATE3").event("2TO3"));
                    //action 또한 곡 설정하지 않아도 됩니다.


sm.dispatch("1TO2")//dispatch를 통해 event를 전달합니다.

console.log(sm.state)//STATE2

```