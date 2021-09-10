import React, { useState, useEffect } from 'react';
import { postData, getDataFromId } from '../../../helper/api';
import ChampionsPanel from '../champions-panel/champions-panel';
import ItemsPanel from '../items-panel/items-panel';
import TraitsPanel from '../traits-panel/traits-panel';
import Button from '@material-ui/core/Button' ;
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import HelpIcon from '@material-ui/icons/Help';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import CopyDialog from '../../../sub-components/copy-dialog/copy-dialog';
import HelpDialog from '../../../sub-components/help-dialog/help-dialog';
import HexagonGrid from '../../../sub-components/hexagon-grid/hexagon-grid';
import { patch_data_url } from '../../../helper/urls';
import { sortTrait } from '../../../helper/sorting';
import { SET_NUMBER, champions_fetch, items_fetch, traits_fetch, champion_patch_combine, item_patch_combine, trait_patch_combine } from '../../../helper/variables';

import './main.css';
import '../../base.css';

const Main = (props) => {
  const [team, setTeam] = useState([]);
  const [champions, setChampions] = useState({});
  const [traits, setTraits] = useState({});
  const [items, setItems] = useState({});
  const [draggedChampion, setDraggedChampion] = useState({});
  const [draggedItem, setDraggedItem] = useState({});
  const [error, setError] = useState(false);
  const [errorSeverity, setErrorSeverity] = useState("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      let champions_arr = champions_fetch();
      let items_arr = items_fetch();
      let traits_arr = traits_fetch();

      try {
        let patchData = await fetch(patch_data_url()).then(res => res.json());
        let thisSet = patchData.setData[SET_NUMBER];

        champions_arr = champion_patch_combine(champions_arr, thisSet.champions);
        items_arr = item_patch_combine(items_arr, patchData.items);
        traits_arr = trait_patch_combine(traits_arr, thisSet.traits);
        setChampions(champions_arr);
        setItems(items_arr);
        setTraits(traits_arr);
        if (props.location.search) {
          if (props.location.state) {
            getDataFromId("teams", props.location.state.teamID).then(data => {
              setTeam(data.team);
              setTeamName(data.name);
              setLoading(false);
              findTraitsInitial(data.team, traits_arr);
            });
          }
        }
        else {
          setLoading(false);
        }
      } catch (err) {
        setError(true);
        setErrorSeverity("error");
        setErrorMessage("Error retrieving patch data: " + err);
        setLoading(false);
      }
    }

    fetchData();
  }, [props]);

  const addToTeam = (e, data) => {
    let team_t = team;
    let champion = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < 28; i++) {
      if (team_t.findIndex(c => c.hexSlot === i) === -1) {
        findTraits(team_t, traits, data);
        team_t.push({champion: champion, tier: 1, items: [], hexSlot: i });
        setTeam(team_t);
        return;
      }
    }
  }

  const removeFromTeam = (data) => {
    let team_t = team;
    if (draggedChampion.hexSlot === undefined) {
      return;
    }

    team_t.splice(team_t.findIndex(c => c.hexSlot === draggedChampion.hexSlot), 1);
    let traits_t = removeTraits(team_t, draggedChampion.champion);
    setTeam(team_t);
    setTraits(traits_t);
  }

  const clearTeam = () => {
    let traits_t = Object.assign({}, traits);
    Object.keys(traits_t).forEach((key, index) => {
      traits_t[key].count = 0;
      traits_t[key].champions = [];
      traits_t[key].tier = -1;
      traits_t[key].color = "";
    });
    setTeam([]);
    setTraits(traits_t);
    setDraggedChampion({});
    setDraggedItem({});
    setTeamName("");
  }

  const findTraitsInitial = (team_t, traits_arr) => {
    let traits_t = JSON.parse(JSON.stringify(traits_arr));
    for (let i of team_t) {
      for (let j of i.champion.traits) {
        if (!traits_t[j].champions.includes(i.champion.championId)) {
          traits_t[j].count++;
        }
        traits_t[j].champions.push(i.champion.championId);
      }
    }
    setTraits(traits_t)
  }

  const findTraits = (team_t, traits_t, champion) => {
    let traits_t_t = JSON.parse(JSON.stringify(traits_t));
    if (champion.name === undefined) {
      return;
    }
    let isDupe = false;
    for (let i of team_t) {
      if (i.champion.name === champion.name) {
        isDupe = true;
      }
    }
    for (let j of champion.traits) {
      if (!isDupe) {
        traits_t_t[j].count++;
      }
      traits_t_t[j].champions.push(champion.championId);
    }
    setTraits(traits_t_t);
  }

  const removeTraits = (champion) => {
    let traits_t = JSON.parse(JSON.stringify(traits));
    if (champion === undefined) {
      return;
    }

    for (let i of champion.traits) {
      traits_t[i].champions.splice(traits_t[i].champions.findIndex(c => c === champion.championId), 1);
      if (traits_t[i].champions.findIndex(c => c === champion.championId) < 0) {
        traits_t[i].count -= 1;
      }
    }
    return traits_t;
  }

  const findTraitsFromEmblem = (champion, trait) => {
    let traits_t = JSON.parse(JSON.stringify(traits));
    
    if (!traits_t[trait].champions.includes(champion.champion.championId)) {
      traits_t[trait].count++;
    }
    traits_t[trait].champions.push(champion.champion.championId);
    setTraits(traits_t);
  }

  const handleChanges = (e) => {
    setTeamName(e.target.value);
  }

  const copy = (event) => {
    setOpenCopyDialog(true);
  }

  const help = (event) => {
    setOpenHelpDialog(true);
  }

  const closeDialog = () => {
    setOpenCopyDialog(false);
    setOpenHelpDialog(false);
  }

  const handleSave = (event) => {
    let traits_t = [];
    for (let i of Object.values(traits)) {
      if (i.count > 0) {
        traits_t.push({key: i.key, champions: i.champions, count: i.count, color: i.color, tier: i.tier});
      }
    }

    traits_t = traits_t.sort(sortTrait);

    let team_t = [];
    for (let i of team) {
      let items_i = [];
      for (let item of i.items) {
        items_i.push(item);
      }

      team_t.push({ champion: { championId: i.champion.championId, traits: i.champion.traits }, tier: i.tier, items: items_i, hexSlot: i.hexSlot });
    }

    let teamName_t = teamName;
    if (teamName_t.trim() === "") {
      teamName_t = `${traits_t[0].count} ${traits[traits_t[0].key].name}, ${traits_t[1].count} ${traits[traits_t[1].key].name}`;
    }

    let teamObj = {name: teamName_t, team: team_t, traits: traits_t, date: new Date(), set: 5};
    postData('teams', teamObj, "");
    setError(true);
    setErrorSeverity("success");
    setErrorMessage(`Successfully saved team ${teamName_t}`);
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  const drag = (e, item) => {
    e.dataTransfer.setData("text", e.target.id);
    setDraggedItem(item);
  }

  const dragChampion = (e, champion) => {
    e.dataTransfer.setData("text", e.target.id);
    let c = JSON.parse(JSON.stringify(champion));
    setDraggedChampion(c);
  }

  const dragFromGrid = (e, hexagonData) => {
    e.dataTransfer.setData("text", e.target.id);
    let hData = JSON.parse(JSON.stringify(hexagonData));
    setDraggedChampion(hData);
  }

  const drop = (e, id) => {
    e.preventDefault();

    let team_t = team;
    if (draggedChampion.championId !== undefined) {

      let index = team_t.findIndex(tm => tm.hexSlot === id);
      if (index > -1) {
        let traits_t = removeTraits(team_t, team_t[index].champion);
        team_t.splice(index, 1);
        findTraits(team_t, traits_t, draggedChampion);
      }
      else {
        findTraits(team_t, traits, draggedChampion);
      }
      team_t.push({champion: draggedChampion, tier: 1, items: [], hexSlot: id });
    }
    
    else if (draggedChampion.champion !== undefined) {
      let originalHexSlot = team_t.findIndex(tm => tm.hexSlot === draggedChampion.hexSlot);
      if (team_t.findIndex(tm => tm.hexSlot === id) > -1) {
        team_t[team_t.findIndex(tm => tm.hexSlot === id)].hexSlot = draggedChampion.hexSlot;
        team_t[originalHexSlot].hexSlot = id;
      }
      else {
        team_t[originalHexSlot].hexSlot = id;
      }
    }

    if (draggedItem.name !== undefined) {
      for (let teamMember of Object.values(team)) {
        if (teamMember.hexSlot === id) {

          if (teamMember.items.includes(draggedItem.id) && draggedItem.isUnique) {
            setError(true);
            setErrorSeverity("warning");
            setErrorMessage("Error: Unique item, only one per champion.");
            setTimeout(() => {
              setError(false);
            }, 3000);
          }

          else if (teamMember.items.includes(99) || teamMember.items.includes(2099)) {
            setError(true);
            setErrorSeverity("warning");
            setErrorMessage("Error: No item slots remaining.");
            setTimeout(() => {
              setError(false);
            }, 3000);
          }

          else if (teamMember.items.length > 0 && (draggedItem.id === 99 || draggedItem.id === 2099)) {
            setError(true);
            setErrorSeverity("warning");
            setErrorMessage("Error: Item consumes three item slots.");
            setTimeout(() => {
              setError(false);
            }, 3000);
          }

          else if (draggedItem.isElusive || 
            (draggedItem.isUnique && (draggedItem.id.toString().includes('8')))) {
              let traitFromItem = draggedItem.name.substring(0, draggedItem.name.indexOf('Emblem')-1);
              let trait = 'Set5_' + traitFromItem.replace(' ', '');
              if (teamMember.items.includes(draggedItem.id)) {
                setError(true);
                setErrorSeverity("warning");
                setErrorMessage("Error: Unique item, only one per champion.");
                setTimeout(() => {
                  setError(false);
                }, 3000);
              }
              else if (teamMember.champion.traits.includes(trait)) {
                setError(true);
                setErrorSeverity("warning");
                setErrorMessage(`Error: Champion is already a ${trait}.`);
                setTimeout(() => {
                  setError(false);
                }, 3000);
              }
              else {
                if (teamMember.items.length < 3) {
                  team_t[team_t.findIndex(t => t === teamMember)].champion.traits.push(trait);
                  team_t[team_t.findIndex(t => t === teamMember)].items.push(draggedItem.id);
                  findTraitsFromEmblem(team_t[team_t.findIndex(t => t === teamMember)], trait);
                }
                else {
                  setError(true);
                  setErrorSeverity("warning");
                  setErrorMessage("Error: No item slots remaining.");
                  setTimeout(() => {
                    setError(false);
                  }, 3000);
                }
              }
            
          }

          else if (teamMember.items.length < 3) {
            team_t[team_t.findIndex(t => t === teamMember)].items.push(draggedItem.id);
          }
          else {
            setError(true);
            setErrorSeverity("warning");
            setErrorMessage("Error: No item slots remaining.");
            setTimeout(() => {
              setError(false);
            }, 3000);
          }
        }
      }
    }
    setTeam(team_t);
    setDraggedItem({});
    setDraggedChampion({});
  }

  const imageError = () => {
    setError(true);
    setErrorSeverity("warning");
    setErrorMessage("Warning: Some images failed to load. Refreshing the page may solve the problem.");
  }

  const dragEnd = () => {
    setDraggedChampion({});
    setDraggedItem({});
  }

  return (
    <div className='page-grid'>
      <div></div>
      <div>
        <h1 className='title'>Builder</h1>
        {loading && <CircularProgress size={24}/>}
        {error && <Alert severity={errorSeverity}>{errorMessage}</Alert>}
        {openCopyDialog && <CopyDialog team={team} traits={traits} items={items} name={teamName} open={openCopyDialog} onClose={closeDialog}/>}
        {openHelpDialog && <HelpDialog open={openHelpDialog} onClose={closeDialog}/>}
        { !loading &&
          <div>
            
            <TextField id="search" type="search" placeholder="Team name" variant="outlined" onChange={handleChanges} value={teamName} className="team-name"/>
            <div className='team-grid'>
              <div className='traits-container'>
                <TraitsPanel traits={traits} champions={champions} team={team} imageError={imageError}/>
              </div>
              <HexagonGrid team={team} champions={champions} items={items} drop={drop} drag={dragFromGrid} dragEnd={dragEnd} imageError={imageError}/>
              <div>
                <Button type="button" className="button-width" onClick={clearTeam}>
                  <ClearIcon className='icon-color'/><span className='icon-color'>Clear</span>
                </Button>
                <Button type="button" className="button-width" onClick={copy}>
                  <FileCopyIcon className='icon-color'/><span className='icon-color'>Copy</span>
                </Button>
                <Button type="button" className="button-width" onClick={handleSave} disabled={team.length === 0}>
                  <SaveIcon className='icon-color'/><span className='icon-color'>Save</span>
                </Button>
                <Button type="button" className="button-width" onClick={help}>
                  <HelpIcon className='icon-color'/><span className='icon-color'>Help</span>
                </Button>
              </div>
            </div>
            <div className='panels-grid'>
              <ChampionsPanel champions={champions} traits={traits} addToTeam={addToTeam} drag={dragChampion} dragEnd={dragEnd} drop={removeFromTeam} imageError={imageError}/>
              <ItemsPanel items={items} drag={drag} dragEnd={dragEnd} imageError={imageError}/>

            </div>
          </div>
        }
      </div>
      <div></div>
    </div>
  );
}

export default Main;

