import Miracle, {render, useState} from './Miracle/index.js';

function App() {
  const [list, setList] = useState<{todo: string, done: boolean}[]>([
    {todo: 'teste1', done: true},
    {todo: 'teste2', done: false},
    {todo: 'teste3', done: true},
    {todo: 'teste4', done: false}
  ]);
  

  return (
    <div>
      {
        list.map((item, index) => {
          return (
            <li>
              <span>{item.todo}</span>
              <button onClick={()=>{
                setList(list => {
                  list[index].done = !list[index].done;
                  return list;
                })
              }}>{item.done ? 'done' : 'to do'}</button>
            </li>
          )
        })
      }
    </div>
  )
}

render(<App />, document.getElementById('root')!);