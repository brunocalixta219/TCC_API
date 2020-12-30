exports.associatePatient = async (req, res) => {
    const { terapistId, patientId } = req.body;

    // TODO: validar se todos os ids foram informados
    // TODO: validar se existem usuários com os IDs informados
    // TODO: validar se terapistId é o ID de um terapeuta
    // TODO: validar se patientId é o ID de um paciente
    // TODO: criar um TerapistController e mover esse método pra lá

    await TerapistPatient.create({ terapist: terapistId, patient: patientId });
    return res.send({ message: 'Cadastrado com sucesso!' });
};
