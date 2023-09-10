import Miracle, {render, useState} from './Miracle/index.js';

function App() {
  const [input, setInput] = useState('');
  const [list, setList] = useState<{todo: string, done: boolean}[]>([
    {todo: 'teste1', done: true},
    {todo: 'teste2', done: false},
    {todo: 'teste3', done: true},
    {todo: 'teste4', done: false}
  ]);
  
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '2em',
      height: '100vh'
    }}>
      <div>
        <h2>To-do list:</h2>
        <div>
          <input onChange={(e:any) => setInput(e.target.value)} value={input} />
          <button 
            onClick={() => {
              if(input.length === 0)
                return;
              setList(prevList => prevList.concat({todo: input, done: false}));
              setInput('');
            }}
          >
            add
          </button>
        </div>
        <ul style={{
          listStyle: 'none'
        }}>
          {
            list.map((item, index) => {
              return (
                <li style={{
                  margin: '.75em'
                }}>
                  <span>{item.todo}</span>
                  <button style={{
                    backgroundColor: item.done ? 'lightgreen' : 'red',
                    borderRadius: '5px',
                    border: 'none',
                    boxShadow: '1px 2px 3px black',
                    padding: '.25em .5em',
                    cursor: 'pointer',
                    margin: '0 .75em'
                  }} onClick={()=>{
                    setList(list => {
                      list[index].done = !list[index].done;
                      return list;
                    })
                  }}>{item.done ? 'done' : 'to do'}</button>
                  <button style={{
                    backgroundColor:'red',
                    borderRadius: '5px',
                    border: 'none',
                    boxShadow: '1px 2px 3px black',
                    padding: '.25em .5em',
                    cursor: 'pointer',
                    margin: '0 .75em',
                    color: 'white'
                  }} onClick={()=>{
                    setList(list => {
                      return list.filter((_, i) => i !== index);
                    })
                  }}>x</button>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

render(<App />, document.getElementById('root')!);