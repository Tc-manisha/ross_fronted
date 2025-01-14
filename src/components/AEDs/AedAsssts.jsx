import React, { useEffect, useState } from "react";
import Plus from "../../img/Plus.svg";
import { toast } from "react-toastify";
import uuid4 from "uuid4";
import moment from "moment";
// import NewAedChargeRow from '../NewAedChargeRow';
// import AedModificationChargePackRow from "../AedModificationChargePackRow";
import NewAedBatteryRow from "../../pages/accounts/AedMain/NewAedbatteryRow";
import NewAedPadRow from "../../pages/accounts/AedMain/NewAedPadRow";
import NewAedChargeRow from "../../pages/accounts/AedMain/NewAedChargeRow";
import AedModificationChargePackRow from "../../pages/accounts/AedMain/AedModificationChargePackRow";
import SingleBatteryInfo from "./SingleBatteryInfo";
import SinglePadInfo from "./SinglePadInfo";

const DefaultChargePack = {
  "battery_info": {
    "bid": "",
    "aed_id": "",
    "section_name": "charge_pack",
    "is_spare": 0,
    "battery_type_id": "",
    "battery_expiration": "",
    "battery_lot": "",
    "battery_udi": "",
    "battery_serial": "",
    "charge_pak_uid": "",
    "charge_pak_pad_1_id": "",
    "charge_pak_pad_2_id": "",
    "install_9v_date": "",
    "install_before_date": "",
    "install_date": "",
    "manufactured_date": "",
    "created_by_id": 1,
    "created_date": "",
    "modified_by_id": "",
    "modified_date": "",
    "deleted_by_id": "",
    "deleted_date": "",
    "active": true
  },
  "pad_1_info": {
    "pid": "",
    "aed_id": "",
    "is_spare": 0,
    "is_pediatric": 0,
    "section_name": "charge_pack",
    "pad_type_id": "",
    "pad_expiration": "",
    "pad_lot": "",
    "pad_udi": "",
    "created_by_id": "",
    "created_date": "",
    "modified_by_id": "",
    "modified_date": "",
    "deleted_by_id": "",
    "deleted_date": "",
    "active": true
  },
  "pad_2_info": {
    "pid": '',
    "aed_id": '',
    "is_spare": 1,
    "is_pediatric": 0,
    "section_name": "charge_pack",
    "pad_type_id": "",
    "pad_expiration": "",
    "pad_lot": "",
    "pad_udi": "",
    "created_by_id": "",
    "created_date": "",
    "modified_by_id": "",
    "modified_date": "",
    "deleted_by_id": "",
    "deleted_date": "",
    "active": true
  },
  "is_readonly": 0
}

const AedAssets = ({
  AedFormData,
  serviceQuestionData,
  handleToggleChange,
  brandList,
  fetchBatteryModel,
  renderBrandName,
  setNewFormData,
  batteryList,
  print_battery_part,
  padList,
  presentError,
  setPresentError,
  contact_id,
  serialNumbersData,
  isPresentText,
  setIsPresentText,
  isPresentErrorFunc,
  inspection_by,
  isInventory
}) => {
  const [BatteryVisibleColumn, setBatteryVisibleColumn] = useState([]);
  const [noPediatricIcon, setNoPediatricIcon] = useState(false);
  const [batteryResetButton, setBatteryResetButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [padResetButton, setPadResetButton] = useState(false);
  const [chargePakResetButton, setChargePakResetButton] = useState(false);
  // const visibleColumns = columns.filter((column) => column.is_default === 1);


  const fillReplacementSerialDD = () => {
    return serialNumbersData?.map((item, i) => {
      return <option value={item?.serial_number}>{item?.serial_number}</option>;
    });
  };

  const handleInputChange = (e, index) => {
    const updatedFormData = [...AedFormData];
    updatedFormData[index].isPresentError = 0;
    var inputValue = e.target.value;
    updatedFormData[index][e.target.name] = inputValue;
    setNewFormData(updatedFormData);
    if (updatedFormData[index][e.target.name] === "") {
      isPresentErrorFunc(inputValue, index, e.target.name);
      //setPresentError(true)
    } else {
    }
  };

  const handleDNDButton = (index, Bindex, row, type) => {
    const Fd = [...AedFormData];

    let is_found = 0;
    for (let i2 = 0; i2 < Fd?.[index]?.dni_array_list.length; i2++) {
      let element = Fd?.[index]?.dni_array_list[i2];
      if (type === "battery") {
        if (element.bid === row.bid) {
          is_found = 1;
        }
      } else {
        if (element.pid === row.pid) {
          is_found = 1;
        }
      }
    }
    const checkArr = Fd?.[index]?.dni_array_list?.find(
      (it) =>
        it.aed_id === row.aed_id &&
        (it?.bid === row?.bid || it?.pid === row?.pid)
    );
    if (!is_found) {
      //toast.success('DNI Addedd Successfully');
      Fd[index].dni_array_list.push(row);
      if (type === "battery") {
        row.accessory_type = 'Battery'
        const biArr = Fd[index].battery_info;
        let dniArr = Fd[index].dni_array_list;
        const deletedBatteryArr = Fd[index].deletedBatteried;
        const removedBattery = biArr[Bindex];
        Fd[index].deletedBatteried = [...deletedBatteryArr, removedBattery];
        Fd[index].battery_info = biArr.filter((_, i) => i !== Bindex);
        dniArr = [removedBattery];
        setNewFormData(Fd);
      } else {
        if (row?.section_name === 'pediatric_pad_info' || row?.section_name === 'spare_padric_pad_info') {
          row.accessory_type = 'Pediatric Pad'
        }
        if (row?.section_name === 'adult_pad_info' || row?.section_name === 'spare_adult_pad_info') {
          row.accessory_type = 'Pad'
        }
        if (row?.section_name === 'adult_pad_pak_info' || row?.section_name === 'spare_adult_pad_pak_info') {
          row.accessory_type = 'Pad Pak'
        }
        const piArr = Fd[index].all_pads;
        let dniArr = Fd[index].dni_array_list;
        const deletedPadsArr = Fd[index].deletedPads;
        const removedPad = piArr[Bindex];
        Fd[index].deletedPads = [...deletedPadsArr, removedPad];
        Fd[index].all_pads = piArr.filter((_, i) => i !== Bindex);
        dniArr = [removedPad];
        setNewFormData(Fd);
      }
      setNewFormData(Fd);
    }
  };

  const HandleDNDChargePack = (index, Bindex, row, type) => {
    const Fd = [...AedFormData];
    const DNIArr = Fd?.[index]?.dni_array_list;
    let is_found = 0;
    for (let i2 = 0; i2 < DNIArr.length; i2++) {
      const element = DNIArr[i2];
      console.log('element', element);
      if (element?.battery_info?.bid === row?.battery_info?.bid) {
        is_found = 1;
      }
    }
    // const checkArr = DNIArr?.find(
    //   (it) =>
    //     it.aed_id === row.aed_id &&
    //     (it?.bid === row?.bid || it?.pid === row?.pid)
    // );
    if (!is_found) {
      //toast.success('DNI Addedd Successfully');
      var combinedObject = {
        battery_info: row.battery_info,
        pad_1_info: row.pad_1_info,
        pad_2_info: row.pad_2_info
      };
      row.battery_info.accessory_type = 'Charge Pak'
      if (Object.keys(row.pad_1_info).length !== 0) {
        row.pad_1_info.accessory_type = 'Charge Pak'
      }
      if (Object.keys(row.pad_2_info).length !== 0) {
        row.pad_2_info.accessory_type = 'Charge Pak'
      }
      // Push the combined object into dni_array_list 
      Fd[index].charge_pak_arr.push(combinedObject);
      console.log(Fd);
      const biArr = Fd[index].charge_pack_list;
      let dniArr = Fd[index].dni_array_list;
      const deletedBatteryArr = Fd[index].deletedChargePak;
      const removedBattery = biArr[Bindex];
      Fd[index].deletedBatteried = [...deletedBatteryArr, removedBattery];
      Fd[index].charge_pack_list = biArr.filter((_, i) => i !== Bindex);
      dniArr = [removedBattery];
      setNewFormData(Fd);
    }
  };

  const onInputChangePads = (val, name, index, bindex, type) => {
    const Fd = [...AedFormData];
    const Fd2 = Fd[index][type][bindex];

    Fd2[name] = val;
    if (name == "type") {
      if (val === "main") {
        Fd2.is_spare = 0;
        Fd2.is_pediatric = 0;
      } else if (val === "spare") {
        Fd2.is_pediatric = 0;
        Fd2.is_spare = 1;
      } else if (val === "pediatric") {
        Fd2.is_pediatric = 1;
        Fd2.is_spare = 0;
      } else if (val === "spare_pediatric") {
        Fd2.is_pediatric = 1;
        Fd2.is_spare = 1;
      }
    }
    Fd[index][type][bindex] = Fd2;
    setNewFormData(Fd);
  };

  const onInputChange = (val, name, index, bindex, type) => {
    const Fd = [...AedFormData];
    const Fd2 = Fd[index][type][bindex];
    const biArr = Fd[index].battery_info;

    Fd2[name] = val;
    if (name == "type") {
      if (val === "main") {
        Fd2.is_spare = 0;
        Fd2.is_pediatric = 0;
        let dd = moment().format("YYYY-MM-DD");
        Fd2.install_date = dd;
      } else if (val === "spare") {
        Fd2.is_pediatric = 0;
        Fd2.is_spare = 1;
        setSelectedOption(val);
        //Fd2.install_date = "";
      }
    }
    Fd[index][type][bindex] = Fd2;
    setNewFormData(Fd);
    return true;
  };


  const handleChargePackInput = (val, name, index, bindex, type, sec_type) => {

    let type2 = 'battery_info';
    if (sec_type === 1) {
      type2 = 'pad_1_info';
    } else if (sec_type === 2) {
      type2 = 'pad_2_info';
    }
    const Fd = [...AedFormData];
    const Fd2 = Fd[index]['charge_pack_list'][bindex][type2];
    // const Fd3 = Fd[index]['charge_pack_list'][bindex] //[type2];
    // const biArr = Fd[index].battery_info;
    // return "";
    Fd2[name] = val;
    if (name == "type") {
      if (val === "main") {
        Fd2.is_spare = 0;
        // Fd2.is_pediatric = 0;
        // let dd = moment().format("YYYY-MM-DD");
        // Fd2.install_date = dd;
      } else if (val === "spare") {
        // Fd2.is_pediatric = 0;
        Fd2.is_spare = 1;
        // setSelectedOption(val);
        //Fd2.install_date = "";
      }
    }
    // Fd[index][type][bindex] = Fd2;
    Fd[index]['charge_pack_list'][bindex][type2] = Fd2;// [type2]
    console.log({ Fd });
    // const newArray = [...AedFormData];
    //   newArray[index] = {
    //     ...newArray[index],
    //     charge_pack_list: [...newArray[index].charge_pack_list, SingleChargePack],
    //   };
    setNewFormData(Fd);
    return true;
  };


  // handleChargePackInput

  const handleBatteryAdd = (index, aed_id, secName) => {
    const id = uuid4();

    const batteryInfo = {
      inventory_id: 0,
      bid: id,
      aed_id: aed_id,
      section_name: secName,
      is_spare: 1,
      battery_type_id: "",
      battery_expiration: "",
      battery_lot: "",
      battery_udi: "",
      battery_serial: "",
      charge_pak_uid: "",
      charge_pak_pad_1_id: "",
      charge_pak_pad_2_id: "",
      install_9v_date: "",
      install_before_date: "",
      install_date: "",
      manufactured_date: "",
      created_by_id: 1,
      created_date: "",
      // "modified_by_id": null,
      // "modified_date": null,
      // "deleted_by_id": null,
      // "deleted_date": null,
      active: true,
      is_readonly: 1,
      is_new: 1,
    };
    const Fd = [...AedFormData];
    if (Fd[index].battery_info) {
      const newArray = [...AedFormData];
      newArray[index] = {
        ...newArray[index],
        battery_info: [...newArray[index].battery_info, batteryInfo],
      };
      setNewFormData(newArray);
    }
  };
  const HandleAddPadInfo = (index, aedId) => {
    const id = uuid4();
    const obj = {
      inventory_id: 0,
      pid: id,
      aed_id: aedId,
      is_spare: 1,
      is_pediatric: 0,
      section_name: "adult_pad_info",
      pad_type_id: "",
      pad_expiration: "",
      pad_lot: "",
      pad_udi: "",
      active: 1,
      is_readonly: 1,
      is_new: 1,
      is_pediatric_section: 0
    };
    const Fd = [...AedFormData];
    if (Fd[index].all_pads) {
      const newArray = [...AedFormData];
      newArray[index] = {
        ...newArray[index],
        all_pads: [...newArray[index].all_pads, obj],
      };
      setNewFormData(newArray);
    }
  };

  const handleChargePakAdd = (index, aed_id, secName) => {
    const SingleChargePack = {
      inventory_id: 0,
      battery_info: { ...DefaultChargePack.battery_info },
      pad_1_info: { ...DefaultChargePack.pad_1_info },
      pad_2_info: { ...DefaultChargePack.pad_2_info },
      is_readonly: 1,
      is_new: 1,
      bid: uuid4(),
      p1id: uuid4(),
      p2id: uuid4(),
      aed_id: aed_id,
    };

    // Assign new UUIDs to each field
    SingleChargePack.battery_info.bid = uuid4();
    SingleChargePack.pad_1_info.pid = uuid4();
    SingleChargePack.pad_2_info.pid = uuid4();


    const newArray = [...AedFormData];
    if (newArray[index].charge_pack_list) {
      newArray[index] = {
        ...newArray[index],
        charge_pack_list: [...newArray[index].charge_pack_list, SingleChargePack],
      };
      setNewFormData(newArray);
    }


    // const Fd = [...AedFormData];
    // if (Fd[index].charge_pack_list) {
    //   const newArray = [...AedFormData];
    //   newArray[index] = {
    //     ...newArray[index],
    //     charge_pack_list: [...newArray[index].charge_pack_list, SingleChargePack],
    //   };
    //   console.log({newArray});
    //   setNewFormData(newArray);
    // }
  };

  const handleCalendarChange = (e) => { };

  const handleChange = (e, index) => {
    const Fd = [...AedFormData];
    Fd[index][e.target.name] = e.target.value;
    setNewFormData(Fd);
  };

  const setDeleteNewBattery = [];

  const handleResetBtn = (index, type) => {
    const Fd = [...AedFormData];
    if (type === 1) {
      // const ar = Fd[index].battery_info;
      // const deletedArr = Fd[index].deletedBatteried;
      // Fd[index].deletedBatteried = [];
      // const companiArr = [...ar, ...deletedArr].filter((it) => it.bid);
      // Fd[index].dni_array_list = [];

      Fd[index].dni_array_list = Fd[index].dni_array_list.filter(
        (item) => !item.hasOwnProperty("bid")
      );
      Fd[index].deletedBatteried = [];
      Fd[index].battery_info = Fd[index].default_battery_info;
      setBatteryResetButton(false);
    } else if (type === 2) {
      // const ar = Fd[index].all_pads;
      // const deletedArr = Fd[index].deletedPads;
      // Fd[index].deletedPads = [];
      // const companiArr = [...ar, ...deletedArr].filter((it) => it.pid);
      //Fd[index].dni_array_list = [];

      Fd[index].dni_array_list = Fd[index].dni_array_list.filter(
        (item) => !item.hasOwnProperty("pid")
      );
      Fd[index].deletedPads = [];
      Fd[index].all_pads = Fd[index].default_all_pads;
      setPadResetButton(false);

    }
    else {
      Fd[index].dni_array_list = Fd[index].dni_array_list.filter(
        (item) => !item.hasOwnProperty("bid")
      );
      Fd[index].deletedChargePak = [];
      Fd[index].charge_pak_arr = [];
      Fd[index].charge_pack_list = Fd[index].default_charge_pak_info;
      setChargePakResetButton(false);
    }
    setNewFormData(Fd);
  };
  const handleRemoveMainBatteryRow = (index, Bindex, ret = 0, type, aed_id) => {
    const Fd = [...AedFormData];
    const biArr = Fd[index].battery_info;
    const deletedArr = Fd[index].deletedBatteried;
    const removedBattery = biArr[Bindex];
    Fd[index].battery_info = biArr.filter((_, i) => i !== Bindex);
    Fd[index].deletedBatteried = [...deletedArr, removedBattery];
    setNewFormData(Fd);
    return ret ? Fd : undefined;
  };

  const handleRemovePadsRow = (index, Pindex, ret = 0, type, aed_id) => {
    const Fd = [...AedFormData];
    const allPadsArr = Fd[index].all_pads;
    const deletedArr = Fd[index].deletedPads;
    const removedPad = allPadsArr[Pindex];
    Fd[index].all_pads = allPadsArr.filter((_, i) => i !== Pindex);
    Fd[index].deletedPads = [...deletedArr, removedPad];
    setNewFormData(Fd);
    return ret ? Fd : undefined;
  };

  const handleRemoveMainChargePakRow = (index, Bindex, ret = 0, type, aed_id) => {
    const Fd = [...AedFormData];
    const biArr = Fd[index].charge_pack_list;
    const deletedArr = Fd[index].deletedChargePak;
    const removedBattery = biArr[Bindex];
    Fd[index].charge_pack_list = biArr.filter((_, i) => i !== Bindex);
    Fd[index].deletedChargePak = [...deletedArr, removedBattery];
    setNewFormData(Fd);
    return ret ? Fd : undefined;
  };

  const handleBatterySpareCrown = (index, Bindex) => {
    let Fd = [...AedFormData];
    const biArr = Fd[index].battery_info;
    const FindIndex = biArr.findIndex((it) => it.is_spare === 0);
    if (FindIndex != -1) {
      toast.error(
        "Please remove main first,  then you can convert spare into main"
      );
      return false;
    } else {
      setBatteryResetButton(true);
    }
    if (Fd[index].battery_info[Bindex]) {
      const newArray = [...AedFormData];
      newArray[index] = {
        ...newArray[index],
        battery_info: newArray[index].battery_info.map((battery, i) => {
          if (i === Bindex) {
            return {
              ...battery,
              is_spare: 0,
              install_date: new Date(), //Update any property as needed
            };
          }
          return battery;
        }),
      };
      setNewFormData(newArray);
    }
  };

  const handlePadSpareCrown = (index, Pindex, type = "main", padSecName) => {
    let Fd = [...AedFormData];
    const allPadArr = Fd[index].all_pads;
    let findIndex = -1;
    if (type == "main") {
      findIndex = allPadArr.findIndex(
        (item) => item.is_spare === 0 && item.is_pediatric === 0
      );
    } else {
      findIndex = allPadArr.findIndex(
        (item) => item.is_spare === 0 && item.is_pediatric === 1
      );
    }
    if (findIndex != -1) {
      if (padSecName === "spare_adult_pad_info") {
        toast.error(
          "Please remove main first,  then you can convert spare into main."
        );
      } else if (padSecName === "spare_padric_pad_info") {
        toast.error(
          "Please remove Pediatric first, then you can convert spare Pediatric into Pediatric."
        );
      }
      return false;
    }
    if (Fd[index].all_pads[Pindex]) {
      const newArray = [...AedFormData];
      newArray[index] = {
        ...newArray[index],
        all_pads: newArray[index].all_pads.map((pads, i) => {
          if (i === Pindex) {
            setPadResetButton(true);
            return { ...pads, is_spare: 0 };
          }
          return pads;
        }),
      };
      setNewFormData(newArray);
    }
  };

  const handleChargeSpareCrown = (index, Bindex) => {
    let Fd = [...AedFormData];
    const biArr = Fd[index].charge_pack_list;
    const FindIndex = biArr.findIndex((it) => it.battery_info.is_spare === 0);

    if (FindIndex != -1) {
      toast.error(
        "Please remove main first,  then you can convert spare into main"
      );
      return false;
    } else {
      setChargePakResetButton(true);
    }
    if (Fd[index].charge_pack_list[Bindex]) {
      const newArray = [...AedFormData];
      newArray[index] = {
        ...newArray[index],
        charge_pack_list: newArray[index].charge_pack_list.map((battery, i) => {
          if (i === Bindex) {
            return {
              battery_info: { ...battery.battery_info, is_spare: 0 },
              pad_1_info: { ...battery.pad_1_info, is_spare: 0 },
              pad_2_info: { ...battery.pad_2_info, is_spare: 0 },
              is_readonly: 0,
            }
          }
          return battery;
        }),
      };
      setNewFormData(newArray);
    }
  };

  const showAdditionalBatteryRows = () => {
    const obj = {};
  };

  const handleRemoveSparePadiatricPadRow = () => { };

  const handleMoveSpareToMainPadRow = () => { };

  const handleReplacementSerial = (e, index) => {
    let Fd = [...AedFormData];
    const matchedObject = serialNumbersData.find(obj => obj.serial_number === e.target.value);
    if (matchedObject) {
      Fd[index] = {
        ...Fd[index],
        ReplacementSerial: e.target.value,
        ReplacementAedId: matchedObject.aed_id
      };
      setNewFormData(Fd);
    }
  };

  const handleAlarmReady = (AedItem, serviceQuestionData) => {

    let storage_info_array

    if (typeof AedItem.storage_info === 'string') {
      storage_info_array = JSON.parse(AedItem.storage_info);
    } else {
      storage_info_array = AedItem.storage_info;
    }

    if (serviceQuestionData?.alarm_batteries_status === true) {
      if (storage_info_array[0].storage_type === "1" || storage_info_array[0].storage_type === "") {
        console.log('storage type Aed cabinet');
        return false
      }
      else {
        console.log('storage type non aed cabinet');
        return true
      }
    }
    else {
      console.log('toggle is off');
      return true
    }
  }

  
  // const sectionPermissions = AedItem ? JSON.parse(AedItem?.section_permissions) :{};
  // let has_9v = sectionPermissions?.has_9v === 1;
  // let has_installby = sectionPermissions?.has_installby === 1;
  // let has_10pk = sectionPermissions?.has_10pk === 1;
  // let has_man = sectionPermissions?.has_man === 1;
  // let has_battery = sectionPermissions?.has_battery === 1;

  //   let hasPad = sectionPermissions.has_pad === 1;
  //   let hasPedpak = sectionPermissions.has_pedpak === 1;
  //   let hasPadpak = sectionPermissions.has_padpak === 1;
  //   let hasPedPad = sectionPermissions.has_ped_pad === 1;
  //   let hasPedKey = sectionPermissions.has_ped_key === 1;



  return (
    <>
      {AedFormData && AedFormData.map((AedItem, index) => (
        <div
          key={index}
          className="mt-4 table-main-20002"
          style={{ width: "100%", paddingInline: "2%" }}
        >
          <SingleBatteryInfo 
              index={index}
              AedItem={AedItem}
              handleBatteryAdd={handleBatteryAdd}
              handleResetBtn={handleResetBtn}
              setDeleteNewBattery={setDeleteNewBattery}
              handleRemoveMainBatteryRow={handleRemoveMainBatteryRow}
              handleBatterySpareCrown={handleBatterySpareCrown}
              print_battery_part={print_battery_part}
              showAdditionalBatteryRows={showAdditionalBatteryRows}
              handleCalendarChange={handleCalendarChange}
              handleChange={handleChange}
              handleDNDButton={handleDNDButton}
              onInputChange={onInputChange}
              AedFormData={AedFormData}
              setNewFormData={setNewFormData}
              contact_id={contact_id}
              inspection_by={inspection_by}
              selectedOption={selectedOption}
              isInventory={isInventory || 0}
              batteryResetButton={batteryResetButton}
          />

          <SinglePadInfo 
          index={index}
          AedItem={AedItem}
          HandleAddPadInfo={HandleAddPadInfo}
          handleResetBtn={handleResetBtn}
          padList={padList}
          AedFormData={AedFormData}
          setNewFormData={setNewFormData}
          handleRemoveSparePadiatricPadRow={handleRemoveSparePadiatricPadRow}
          handleMoveSpareToMainPadRow={handleMoveSpareToMainPadRow}
          handleCalendarChange={handleCalendarChange}
          handleChange={handleChange}
          handleRemovePadsRow={handleRemovePadsRow}
          handlePadSpareCrown={handlePadSpareCrown}
          onInputChangePads={onInputChangePads}
          handleDNDButton={handleDNDButton}
          inspection_by={inspection_by}
          contact_id={contact_id}
          isInventory={isInventory || 0}
          padResetButton={padResetButton}
          setpadResetButton={setPadResetButton}
          />



          {AedItem?.section_permissions && JSON.parse(AedItem?.section_permissions).has_chargepak === 1 ?
            <div className="col py-2">
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="heading">Charge Pak Information
                  <img src={Plus} onClick={() => handleChargePakAdd(index, AedItem.aed_id, AedItem?.battery_section_name)}

                    style={{ cursor: "pointer" }} />
                </h2>
                {AedItem?.dni_array_list.length > 0 &&
                  AedItem.dni_array_list.some(item => item.hasOwnProperty('bid')) ||
                  AedItem.charge_pack_list.slice(0, AedItem?.default_charge_pak_info.length).length !== AedItem?.default_charge_pak_info.length ||
                  (AedItem?.deletedChargePak.length > 0 && AedItem.deletedChargePak.some(item => !item.hasOwnProperty('inventory_id'))) ||
                  chargePakResetButton ? (
                  <button
                    type='button'
                    style={{
                      borderRadius: '10%',
                      backgroundColor: '#f24646',
                      color: 'white',
                      height: '30px',
                      width: '52px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                    }}
                    onClick={() => handleResetBtn(index, 3)}
                  >
                    Reset
                  </button>
                ) : ""}
              </div>
              <table className="theme-table">
                <thead>
                  <tr>
                    <td className='border border-r-blue' >Charge Pak Type</td>
                    <td className='border border-r-blue'>Part #</td>
                    <td className='border border-r-blue'>Expiration Date</td>
                    <td className='border border-r-blue'>Lot</td>
                    <td className='border border-r-blue'>UDI</td>
                    <td className='border border-r-blue' style={{ maxWidth: "70px", minWidth: "60px" }}>Actions</td>
                  </tr>
                </thead>
                <tbody className="">
                  {AedItem?.charge_pack_list.map((chargeItem, Bindex) => (
                    <AedModificationChargePackRow
                      setDeleteNewBattery={setDeleteNewBattery}
                      handleRemoveMainChargePakRow={handleRemoveMainChargePakRow}
                      handleChargeSpareCrown={handleChargeSpareCrown}
                      list_item={chargeItem}
                      batteryInfo={chargeItem}
                      charge_pack_obj={chargeItem}
                      default_battery_info={AedItem.default_battery_info}
                      is_readonly={chargeItem?.is_readonly || 0}
                      Bindex={Bindex}
                      print_battery_part={print_battery_part}
                      index={index}
                      showAdditionalBatteryRows={showAdditionalBatteryRows}
                      handleCalendarChange={handleCalendarChange}
                      handleChange={handleChange}
                      batteryList={AedItem?.battery_type_list || []}
                      handleDNDButton={HandleDNDChargePack}
                      handleResetBtn={handleResetBtn}
                      // onInputChange={onInputChange}
                      onInputChange={handleChargePackInput}
                      AedFormData={AedFormData}
                      setNewFormData={setNewFormData}
                      contact_id={contact_id}
                      inspection_by={inspection_by}
                      selectedOption={selectedOption}
                      batteryvisibleColumns={AedItem?.batteryvisibleColumns || []}
                      aedPadTypeList={AedItem?.aedPadTypeList || []}
                      isInventory={isInventory}
                    />
                  ))}
                </tbody>
              </table>

            </div>
            : ""}
        </div>
      ))}
    </>
  );
};
export default AedAssets;
