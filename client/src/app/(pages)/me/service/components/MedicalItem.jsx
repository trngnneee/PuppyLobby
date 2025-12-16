export const MedicalItem = ({ item }) => {
  return (
    <div className="border rounded-xl p-4 bg-gray-100 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-600">Pet:</p>
          <p className="text-base">{item.pet}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-600">Doctor:</p>
          <p className="text-base">{item.doctor}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Symptoms</p>
        <p className="text-base">
          {item.symptoms}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Diagnosis</p>
        <p className="text-base">
          {item.diagnosis}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Prescription</p>
        <ul className="list-disc list-inside text-base">
          {item.prescription.map((med, index) => (
            <li key={index}>{med}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Follow-up Date</p>
        <p className="text-base">{item.followUpDate}</p>
      </div>
    </div>
  );
};
