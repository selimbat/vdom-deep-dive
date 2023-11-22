import { Component } from "../../lib/component"
import { makeStyle } from "../../utils/style";

interface ToDoItemProps {
    name: string;
    done: boolean;
    toggleItem: () => void;
    removeItem: () => void;
}

export default class ToDoItem extends Component<ToDoItemProps, {}> {
    render() {
        const styles = {
            list: {
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center'
            },
            text: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textDecoration: this.props.done ? 'line-through' : undefined,
                color: this.props.done ? 'gray' : 'inherit',
            }
        }
        return (
            <li style={makeStyle(styles.list)} key='to-do-item'>
                <button
                    style='margin-right: 1rem;'
                    key='toggle-btn'
                    onclick={() => this.props.toggleItem()}
                >
                    {this.props.done ? '✅' : '⬜'}
                </button>
                <span key="text-span">{this.props.name}</span>
                <button
                    style='margin-left: auto;'
                    key='remove-btn'
                    onclick={(e: MouseEvent) => this.props.removeItem()}
                >
                    ✖
                </button>
            </li>
        );
    }
}
