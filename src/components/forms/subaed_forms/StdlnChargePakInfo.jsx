import React, { useState } from 'react'
import { Col,Form } from 'react-bootstrap';
import CommonDatePicker from '../../common/date-picker/CommonDatePicker';
import BatteryPakComp from './sub-comp/BatteryPakComp';
import { HandleUnknow } from '../../../helper/BasicFn';
import PadPartSelect from './sub-comp/PadPartSelect';
import { useEffect } from 'react';
import StdlnBatteryPakComp from './sub-comp/StdlnBatteryPakComp';
import StdlnPadPartSelect from './sub-comp/StdlnPadPartSelect';

function StdlnChargePakInfo({title,
    is_unknowntrue,
    crrIndex,
    formData,
    setFormData,
    handleCheckBox,
    handleInput,
    crrFormData,
    addMore,
    keyName,
    BatteryList,
    padList,
    all_condition_true,
    toogleKeyName,
    is_edit=false,
    chargepakRequired,
    submitRequired
  }) {
    const [padcondi,setPadCondi] = useState(0);
    const handleChange = (e)=>{
        let index =crrIndex;
        let name = e.target.name;
        let val  = e.target.value;
        const oldData = {...formData};

        if(name==='charge_pak_part'){
          let findPadKey = BatteryList.find((item)=> item.battery_type_id===parseInt(val)) 
          // setPadCondi()
          if(findPadKey){
            setPadCondi(findPadKey?.pad_qty);
          }
          // oldData[keyName][crrIndex]['pad_1_part'] = val;
          // oldData[keyName][crrIndex]['pad_2_part'] = val;
        }
        // let objDatalist  =  oldData[keyName];
        // let newArr = objDatalist.map((item,i)=>{
        //   if(i===index){
        //     return {
        //       ...item,
        //       [name]: val
        //     };
        //   }else{
        //       return item;
        //   }
        // })
        // oldData[keyName] = newArr; 
        oldData[keyName][crrIndex][name] = val;
        setFormData(oldData);
      }

      const handleDateChange = (name,val)=>{
        const oldData = {...formData};
        oldData[keyName][crrIndex][name] = val;
        setFormData(oldData);;
  }

  useEffect(()=>{
    if(is_edit){
      const val = crrFormData?.charge_pak_part;
      let findPadKey = BatteryList.find((item)=> item.battery_type_id===parseInt(val)) 
      if(findPadKey){
        setPadCondi(findPadKey?.pad_qty);
      }
    }
  },[crrFormData?.charge_pak_part,BatteryList]);
  return (
    <>
    

        <div className='row' >

            <hr/>
          <Form.Group className='col'>
          <Form.Label>Charge Pak Part* # </Form.Label>
          <StdlnBatteryPakComp
          disabled={is_unknowntrue}  
            name="charge_pak_part"  
            crrFormData={crrFormData} 
            BatteryList={BatteryList} 
            handleInputChange={handleChange} 
            crrIndex={crrIndex}
            chargepakRequired={chargepakRequired} 
           />
          </Form.Group>
          <Form.Group className='col'>
            <Form.Label>Charge Pak UDI</Form.Label>
            <Form.Control type="text" disabled={is_unknowntrue} name="charge_pak_uiid" value={HandleUnknow(crrFormData?.charge_pak_uid)} onChange={handleChange} />
          </Form.Group>
          <Form.Group className='col'>
            <Form.Label>Battery Expiration*</Form.Label>
            <CommonDatePicker
              disabled={is_unknowntrue} 
              calName={'battery_expiration'}
              CalVal={crrFormData?.battery_expiration}
              HandleChange={handleDateChange}
              chargepakRequired={chargepakRequired} 
              // isRequired={chargepakRequired} 
              isRequired={(!crrFormData?.battery_expiration || crrFormData?.battery_expiration === 'unknown') && (chargepakRequired && submitRequired)}
             />
          </Form.Group>
          <Form.Group className='col'>
            <Form.Label>Battery Lot</Form.Label>
            <Form.Control type="text" disabled={is_unknowntrue} name="battery_lot" value={HandleUnknow(crrFormData?.battery_lot)} onChange={handleChange} />
          </Form.Group>
          <Form.Group className='col'>
            <Form.Label>Qty</Form.Label>
            <Form.Control type="text" disabled={is_unknowntrue}
              name="quantity"
              value={crrFormData?.quantity} 
              onChange={handleChange} 
              />
          </Form.Group>
          </div>


          <div className='row mt-4 '>
          {padcondi  || all_condition_true?  
          <Form.Group className='col'>
            <Form.Label>Pad 1 Part* #</Form.Label>
            {/* <BatteryPakComp
            disabled={is_unknowntrue}  
            name="pad_1_part"  
            crrFormData={crrFormData} 
            BatteryList={BatteryList} 
            handleInputChange={handleChange} 
            crrIndex={crrIndex} 
          /> */}
          <StdlnPadPartSelect
						disabled={is_unknowntrue}
						name="pad_1_part"
						crrFormData={ crrFormData }
						padList={ padList }
						handleInputChange={ handleChange }
						crrIndex={ crrIndex }
						is_adult={ 1 }
						toogleKeyName={ toogleKeyName }
            chargepakRequired={chargepakRequired}
         />
          </Form.Group>
          :""}
       
        {padcondi  || all_condition_true? 
          <>
          <Form.Group className='col'>
            <Form.Label>Pad 1 Expiration*</Form.Label>
            <CommonDatePicker
              disabled={is_unknowntrue} 
              calName={'pad_1_expiration'}
              CalVal={crrFormData?.pad_1_expiration}
              HandleChange={handleDateChange}
              isRequired={(!crrFormData?.pad_1_expiration || crrFormData?.pad_1_expiration === 'unknown') && (chargepakRequired && submitRequired)}
              />

          </Form.Group>
          <Form.Group className='col'>
            <Form.Label>Pad 1 Lot</Form.Label>
            <Form.Control type="text" disabled={is_unknowntrue} name="pad_1_lot" value={HandleUnknow(crrFormData?.pad_1_lot)} onChange={handleChange} />
          </Form.Group>
          </>:""}
          </div>


          <div className='row mt-4 '>
          {parseInt(padcondi) === 2 ||  all_condition_true ? <> 
          <Form.Group className='col'>
            <Form.Label>Pad 2 Part* #</Form.Label>
            {/* <BatteryPakComp
            disabled={is_unknowntrue}  
              name="pad_2_part"  
              crrFormData={crrFormData} 
              BatteryList={BatteryList} 
              handleInputChange={handleChange} 
              crrIndex={crrIndex} 
          /> */}
            <StdlnPadPartSelect
              disabled={is_unknowntrue}
              name="pad_2_part"
              crrFormData={ crrFormData }
              padList={ padList }
              handleInputChange={ handleChange }
              crrIndex={ crrIndex }
              is_adult={ 1 }
              toogleKeyName={ toogleKeyName }
              chargepakRequired={chargepakRequired}
            />
          </Form.Group>
          <Form.Group className='col'>
            <Form.Label>Pad 2 Expiration*</Form.Label>
            <CommonDatePicker
              disabled={is_unknowntrue} 
              calName={'pad_2_expiration'}
              CalVal={crrFormData?.pad_2_expiration}
              HandleChange={handleDateChange}
              isRequired={(!crrFormData?.pad_2_expiration || crrFormData?.pad_2_expiration === 'unknown') && (chargepakRequired && submitRequired)}
              />
          </Form.Group>
          <Form.Group className='col'>
            <Form.Label>Pad 2 Lot</Form.Label>
            <Form.Control type="text" disabled={is_unknowntrue} name="pad_2_lot" value={HandleUnknow(crrFormData?.pad_2_lot)} onChange={handleChange} />
          </Form.Group>
          </>:""}
        </div>
    </>
  )
}

export default StdlnChargePakInfo