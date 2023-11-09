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
composable and extensible. You can find out how to be involved in developing 
MyST Markdown by getting involved in the [ExecutableBooks][executable-books] project.
:::


$$
f(x)=x
$$



:::{note}
  Nota N
:::

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
