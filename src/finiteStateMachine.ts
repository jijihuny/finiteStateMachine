

interface Transition<State, Event> {

    event: Event;
    
    next: State;

    action?: ()=> void;

}

class TransitionBuilder<State, Event> {

    private _from?: State;

    private _event?: Event;

    private _to?: State;

    private _action?: (event?: Event)=> void

    private constructor() {

    }

    static builder<State, Event>() {
        return new TransitionBuilder<State, Event>();
    }

    static of<State, Event>(builder: (transition: TransitionBuilder<State, Event>)=> TransitionBuilder<State, Event>) {

        const transitionBuilder = new TransitionBuilder<State, Event>();

        return builder(transitionBuilder).build();

    }

    from(from: State) {

        this._from = from;

        return this;
    }

    event(event: Event) {
        this._event = event;

        return this;
    }

    to(to: State) {
        this._to = to;

        return this;
    }

    action(action: (event?: Event)=> void) {
        this._action = action;

        return this;
    }

    build(): Transition<State, Event> & {state : State} {

        if(!this._from) {
            throw new Error("Source State must be specified");
        }

        if(!this._event) {
            throw new Error("Event must be specified");
        }

        if(!this._to) {
            throw new Error("Next state must be specified");
        }

        return {
            state: this._from,
            event: this._event,
            next: this._to,
            action: this._action
        }

    }

}

interface Action {
    
    entry?: ()=>void;

    exit?: ()=>void;

}

class StateBuilder<State> {

    _state?: State;

    private _entry?: ()=> void;

    private _exit?: ()=> void;

    private constructor() {

    }

    static of<State>(builder: (state: StateBuilder<State>)=> StateBuilder<State>) {

        const stateBuilder = new StateBuilder<State>();

        return builder(stateBuilder).build();

    }

    state(state: State) {
    
        this._state = state;

        return this;
    
    }

    entry(entry: ()=> void) {

        this._entry = entry;

        return this;

    } 

    exit(exit: ()=> void) {

        this._exit = exit;

        return this;

    }

    build(): Action & {state: State} {

        if(!this._state) {
            throw new Error("State must be specified");
        }

        return {

            state: this._state,
            
            entry: this._entry,
            
            exit: this._exit
        
        }

    }

}   

export class StateMachine<State, Event> {

    state: State;

    private _actions: Map<State, Action>;

    private _transitions: Map<State, Transition<State, Event>[]>;

    private constructor(initialState: State, action: Action) {

        this._actions = new Map();

        this._transitions = new Map();
        
        this.state = initialState;

        this._actions.set(this.state, action);

    }

    static initial<State, Event>(builder: (state: StateBuilder<State>)=> StateBuilder<State>) {

        const initialState = StateBuilder.of(builder)

        return new StateMachine<State, Event>(initialState.state, initialState);

    }

    with(builder: (state: StateBuilder<State>)=> StateBuilder<State>) {

        const newState = StateBuilder.of(builder);

        this._actions.set(newState.state, newState);

        return this;

    }

    on(builder: (transition: TransitionBuilder<State, Event>)=> TransitionBuilder<State, Event>) {

        const transition = TransitionBuilder.of(builder);

        if(!this._transitions.has(transition.state)) {

            this._transitions.set(transition.state, []);

        }

        this._transitions.get(transition.state)?.push(transition);

        return this;
    }

    dispatch(event: Event) {

        if(!this._transitions.has(this.state)) {
            return;
        }

        const transition = this._transitions.get(this.state)!.find(T=> T.event === event);

        if(!transition) {
            return;
        }

        const exit = this._actions.get(this.state)!.exit;

        if(exit) {
            exit();
        }

        const action = transition.action;

        if(action) {
            action();
        }

        this.state = transition.next;

        const entry = this._actions.get(this.state)!.entry;

        if(entry) {
            entry();
        }
        
    }

}
