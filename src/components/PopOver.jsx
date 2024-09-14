import React, { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';


export default function PopOver(handleSubmit,handleInputChange) {
    const op = useRef(null);

    return (
        <div className="card flex justify-content-center">
            <img  onClick={(e) => op.current.toggle(e)} src="../../public/pop_over.png" alt="" style={{height:"15px"}}/>
            <OverlayPanel ref={op}>
              <div className='flex-col'>
                <input type="text"/>
                <button>submit</button>
              </div>
            </OverlayPanel>
        </div>
    );
}
        