import React from 'react';
import logo from './logo.svg';
import './App.css';

import CodeMirror from '@uiw/react-codemirror';
import MystPreview from './MystPreview.js';

function App() {

  const [value, setValue] = React.useState(`---
  title: Preview of MyST Markdown
  subtitle: Or die trying with the subtitle
  authors:
    - name: Javier Boncompte
      affiliations:
        - Department of Economics, University College London
  license: CC-BY-4.0
  ---
  
  # Title1 
  
  dssfsdsdfsdf
  
  :::{important} Our Values
  We believe in a community-driven approach of open-source tools that are
  composable and extensible.
  :::
  
  ## Including Figures and Images

  :::{figure} https://source.unsplash.com/random/400x200?beach,ocean
  :name: my-fig
  :alt: Random image of the beach or ocean!
  
  Relaxing at the beach 🏝 🌊 😎
  :::
  

  :::{math}
  :label: foc
  
  ssds=ddsdd
  :::
  
  And now, we reference Eq. {eq}\`foc\`
  
  $$
  f(x)=x
  $$ (mylabel)
  
  And now the above {eq}\`mylabel\`
  
  :::{note}
    Nota N
  :::
  
  ## Including Tables

:::{list-table} This is a nice table!
:header-rows: 1
:name: example-table

* - Training
  - Validation
* - 0
  - 5
* - 13720
  - 2744
:::

And so we can reference the {numref}\`example-table\`
    

  `);

  const onChange = React.useCallback((val, viewUpdate) => {
    //console.log('val:', val);
    setValue(val);
  }, []);

  return (
    <div className="App">
      <div className="panel-wrapper">
        <CodeMirror value={value} height="100%" onChange={onChange} />
        <MystPreview className="panel" value={value} />
      </div>
    </div>
  );
}

export default App;
