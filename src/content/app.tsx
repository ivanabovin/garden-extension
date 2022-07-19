import React from 'react';
import { observer } from 'mobx-react-lite';

export const App = observer(() => {
  return <div className="frame">
    <div>
      <input type="text" />
    </div>
    <h6>Numbers</h6>
    <p>
      Most individuals don't think about numbers, or numerical representations of quantity, but they play a major part
      in everyday life. To be sure, numbers determine the time individuals will wake up in the morning, how much money
      employees earn per hour, what day of the year it is, and much, much more.
    </p>
    <p>
      Additionally, numbers impact everyday living on a much smaller scale. In the grocery store, for instance, numbers
      determine products' prices, the amount of a product available for purchase, how much money will need to be paid
      for
      products, and a whole lot else.
    </p>
    <p>
      To understand larger (and more intimidating numbers), interested persons first need to understand basic numbers,
      or
      numbers from one to ten, as they comprise each and every advanced number, or a multi-digit number that indicates a
      larger amount/quantity.
    </p>
    <p>
      The basic numbers are as follows:
    </p>
    <div>
      <button>button</button>
    </div>
  </div>;
});
