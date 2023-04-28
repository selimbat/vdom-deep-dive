import { Component, createComponent } from "../../lib/component"
import { createElement, createText } from "../../lib/vdom"
import { makeStyle } from "../../utils/style"
import NewItemForm from "./NewItemForm"
import ToDoItem from "./ToDoItem"


interface ToDoState {
    items: Array<{
        name: string
        done: boolean
    }>
}

export default class App extends Component<{}, ToDoState> {

    state: ToDoState = { items: [] }

    toggleItem(index: number) {
        this.setState(s => ({
            items: s.items.map((item, i) => {
                if (index == i) return { ...item, done: !item.done }
                return item
            })
        }))
    }

    removeItem(index: number) {
        this.setState(s => {
            const newItems = Array.from(s.items);
            newItems.splice(index, 1);
            return {
                items: newItems,
            }
        })
    }

    render() {
        const styles = {
            root: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: '1.4rem',
            },
            toDoList: {
                listStyleType: 'none',
                padding: '0',
                width: '30rem',
            }
        }

        return createElement('div',
            {
                key: 'root',
                style: makeStyle(styles.root),
            },
            createComponent(NewItemForm, {
                key: 'form',
                addItem: n => this.setState(s => ({ items: s.items.concat([{ name: n, done: false }]) }))
            }),
            createElement('ul',
                {
                    style: makeStyle(styles.toDoList),
                    key: 'items',
                },
                ...this.state.items.map((item: ToDoState['items'][number], i) =>
                    createComponent(ToDoItem, {
                        key: i,
                        name: item.name,
                        done: item.done,
                        toggleItem: () => this.toggleItem(i),
                        removeItem: () => this.removeItem(i),
                    })
                )
            )
        )
    }
}
