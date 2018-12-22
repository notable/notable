
/* IMPORT */

import * as _ from 'lodash';
import Utils from '../utils';

/* TODO */

const Todo = {

  bulletSymbol: '-',
  doneSymbol: 'x',

  lineRe: /^(\s*)([*+-]?\s*)(.*)$/,
  todoRe: /^(\s*)([*+-]\s+\[[ xX]\]\s*)(.*)$/,
  todoBoxRe: /^(\s*)([*+-]\s+\[ \]\s*)(.*)$/,
  todoDoneRe: /^(\s*)([*+-]\s+\[[xX]\]\s*)(.*)$/,

  toggleRules ( cm, rules ) {

    Utils.walkSelections ( cm, ( line, lineNr ) => {

      rules.find ( ([ regex, replacement ]) => {

        if ( !regex.test ( line ) ) return false;

        const lineNext = line.replace ( regex, replacement );

        Utils.replace ( cm, lineNr, lineNext, 0, line.length );

        return true;

      });

    });

  },

  toggleBox ( cm ) {

    const {bulletSymbol, lineRe, todoBoxRe, todoDoneRe} = Todo;

    Todo.toggleRules ( cm, [
      [todoBoxRe, '$1$3'],
      [todoDoneRe, `$1${bulletSymbol} [ ] $3`],
      [lineRe, `$1${bulletSymbol} [ ] $3`]
    ]);

  },

  toggleDone ( cm ) {

    const {bulletSymbol, doneSymbol, lineRe, todoBoxRe, todoDoneRe} = Todo;

    Todo.toggleRules ( cm, [
      [todoDoneRe, `$1${bulletSymbol} [ ] $3`],
      [todoBoxRe, `$1${bulletSymbol} [${doneSymbol}] $3`],
      [lineRe, `$1${bulletSymbol} [${doneSymbol}] $3`]
    ]);

  }

};

/* EXPORT */

export default Todo;
