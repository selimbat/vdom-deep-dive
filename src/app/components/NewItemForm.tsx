import { Component } from "lib/component"
import { makeStyle } from "utils/style"


interface NewItemFormState {
    name: string
}

interface NewItemFormProps {
    addItem: (name: string) => void
}

export default class NewItemForm extends Component<NewItemFormProps, NewItemFormState> {

    state = { name: '' }

    render() {
        const styles = {
            form: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },
            label: {
                fontSize: '3rem',
                padding: '2rem',
            },
            input: {
                width: '120%',
                fontSize: 'inherit',
            }
        }
        return (
            <form
                style={makeStyle(styles.form)}
                key="new-item-form"
                onsubmit={(e: Event) => {
                    e.preventDefault();
                    if (this.state.name) {
                        this.props.addItem(this.state.name);
                        this.setState(() => ({ name: '' }));
                    }
                }}
            >
                <label
                    style={makeStyle(styles.label)}
                    key="form-label"
                    for="form-input"
                >
                    My To Do App
                </label>
                <input
                    style={makeStyle(styles.input)}
                    key='form-input'
                    id='form-input'
                    value={this.state.name}
                    oninput={(e: any) => this.setState(s => Object.assign(s, { name: e.target.value }))}
                />
            </form>
        )
    }
}

