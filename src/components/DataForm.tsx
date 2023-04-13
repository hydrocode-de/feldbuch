import { IonItem, IonLabel } from "@ionic/react";
import { useDatasetFilter } from "../features/filter";
import { Dataset } from "../supabase/feldbuch.model"

// load data overlays
import DataInputG1 from "./DataInputG1";
import DataInputG2 from "./DataInputG2";
import DataInputG3 from "./DataInputG3";
import DataInputG4 from "./DataInputG4";

interface DataFormProps {
    plot_id: number,
    defaults?: Dataset,
    onSave?: (data: Dataset) => void,
}

const DataForm: React.FC<DataFormProps> = ({plot_id, defaults, onSave }) => {
    // component state
    const { group } = useDatasetFilter();

    // the current group can be temporarily overwritten by the values
    const groupId = defaults?.group_id || group?.id

    // save handler
    const saveHandler = (data: {[key: string]: number | string | Date | Boolean}) => {
        // create the object
        const dataset: Dataset = {plot_id, data, group_id: defaults?.group_id || group!.id}
        onSave!(dataset)
    }
    
    // switch the form
    let form: any;
    if (!groupId) {
        return <IonItem><IonLabel style={{textAlign: 'center'}}>Please select the data type first</IonLabel></IonItem>
    }
    switch (groupId) {
        case 1:
            form = <DataInputG1 onSave={saveHandler} values={defaults?.data} />;
            break;
        case 2:
            form = <DataInputG2 onSave={saveHandler} values={defaults?.data} />;
            break;
        case 3:
            form = <DataInputG3 onSave={saveHandler} values={defaults?.data} />;
            break;
        case 4:
            form = <DataInputG4 onSave={saveHandler} values={defaults?.data} />;
            break;
            
        default:
            return (
                <IonItem color="danger">
                    <IonLabel>Got an undefined group identifier</IonLabel>
                </IonItem>
            );
    }

    return form
}

export default DataForm