const tBody = document.getElementById("tbody");
document.addEventListener('DOMContentLoaded', function () {
    loadData()
    .then( result =>{
        console.log(result)
        if(result.state){
            result.data.forEach(plate =>{
                addRowToTable(plate);
            })
        }
    })
});

//obtener la información de la api
function loadData() {
    return new Promise((resolve, reject) => {
        fetch('https://api-dishes.vercel.app')
            .then(result => result.json())
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
// Obtener la información del formulario para agregar
const loadFields = () => {
    const idValue = document.getElementById('id').value;
    const nameValue = document.getElementById('name').value;
    const caloriesValue = document.getElementById('calories').value;
    const isVegetarian = document.getElementById('isVegetarian').checked; 
    const valueValue = document.getElementById('value').value;
    const commentsValue = document.getElementById('comments').value;

    
     if (!idValue || !nameValue || !caloriesValue || !valueValue || !commentsValue) {
        Swal.fire('Por favor, completa todos los campos.', '', 'error');
        return null;
    }
     
    
     if (!isNumber(caloriesValue) || !isNumber(valueValue)) {
        Swal.fire('Por favor, ingresa solo números en los campos de Calorias y Valor.', '', 'error');
        return null; 
    }

    
    if (isNaN(parseInt(caloriesValue)) || parseInt(caloriesValue) <= 50) {
        Swal.fire('Por favor, ingresa un valor de calorías válido y mayor a 50.', '', 'error');
        return null;
    }

    const data = {
        "idDish": idValue,
        "name": nameValue,
        "calories": parseInt(caloriesValue),
        "isVegetarian": isVegetarian,
        "value": parseInt(valueValue),
        "comments": commentsValue
    };
    return JSON.stringify(data);
};

document.getElementById("btnSend").addEventListener('click', () => {

    const URI = "https://api-dishes.vercel.app";

    
     const fieldsData = loadFields();
     if (fieldsData === null) {
         return; 
     }
    fetch(URI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: loadFields()
    }).then(result => result.json())
        .then(result => {
            if (result.state) {
                const newPlate = result.data;
                addRowToTable(newPlate);
                Swal.fire('Se ha agregado la información!!!', '', 'success');
            } else {
                Swal.fire({
                    title: 'Ohh! Algo ha salido mal',
                    text: result.data || 'Error desconocido',
                    icon: 'error'
                });
            }
        }).catch(err => {
            Swal.fire({
                title: 'Ohh! Algo ha salido mal en fetch',
                text: err.message || 'Error desconocido',
                icon: 'error'
            });
        })
});

function addRowToTable(plate){
    const row = document.createElement('tr');
    row.id = `row-${plate._id}`;

    const colId = document.createElement('td');
    colId.appendChild(document.createTextNode(plate.idDish));
    row.append(colId);

    const colName = document.createElement('td');
    colName.appendChild(document.createTextNode(plate.name));
    row.appendChild(colName);

    const colCalories = document.createElement('td');
    colCalories.appendChild(document.createTextNode(plate.calories));
    row.appendChild(colCalories);

    const colisVegetarian = document.createElement('td');
    colisVegetarian.appendChild(document.createTextNode(plate.isVegetarian));
    row.appendChild(colisVegetarian);

    const colvalue = document.createElement('td');
    colvalue.appendChild(document.createTextNode(plate.value));
    row.appendChild(colvalue);

    const colcomments = document.createElement('td');
    colcomments.appendChild(document.createTextNode(plate.comments));
    row.appendChild(colcomments);

    const colDelete = document.createElement('td');
    colDelete.className = 'delete-icon-cell text-center align-middle';
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt';
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.addEventListener('click', () => handleDelete(plate._id));
    colDelete.appendChild(deleteIcon);
    row.appendChild(colDelete);
    
    tBody.appendChild(row);

}


function handleDelete(plateId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres borrar el plato con ID ${plateId}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
        if (result.isConfirmed) {
            const URI = `https://api-dishes.vercel.app/${plateId}`;

            fetch(URI, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(result => result.json())
                .then(result => {
                    if (result.state) {
                        Swal.fire(
                            '¡Eliminado!',
                            `Plato con ID ${plateId} eliminado exitosamente.`,
                            'success'
                        );
                        const deletedRow = document.getElementById(`row-${plateId}`);
                        if (deletedRow) {
                            deletedRow.remove();
                        } else {
                            console.warn('La fila no se encontró en la interfaz');
                        }
                    } else {
                        Swal.fire(
                            'Error',
                            'Algo salió mal al intentar borrar el plato.',
                            'error'
                        );
                    }
                })
                .catch(err => console.error(err));
        }
    });
}

//buscar por id
document.getElementById("btnSearch").addEventListener('click', () => {
    const searchId = document.getElementById('searchId').value;
    const searchURI = `https://api-dishes.vercel.app/${searchId}`;

    fetch(searchURI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(result => result.json())
        .then(result => {
            if (result.state) {
                const foundPlate = result.data;
                Swal.fire({
                    title: 'Plato encontrado',
                    html: `<b>ID:</b> ${foundPlate.idDish}<br>
                           <b>Nombre:</b> ${foundPlate.name}<br>
                           <b>Calorías:</b> ${foundPlate.calories}<br>
                           <b>Es vegetariano:</b> ${foundPlate.isVegetarian}<br>
                           <b>Valor:</b> ${foundPlate.value}<br>
                           <b>Comentarios:</b> ${foundPlate.comments}`,
                    icon: 'success',
                });
            } else {
                Swal.fire('Plato no encontrado', '', 'error');
            }
        })
        .catch(err => console.error(err));
});

