import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label";
import { speciesOptions } from "@/config/variable.config";

export const ExistUserUI = ({ petList, targetPet, setTargetPet }) => {
  return (
    <>
      {petList.length > 0 && (
        <div>
          <div className="mt-6">
            <Label className="text-sm font-medium text-[var(--main)]">Existing Pet List</Label>

            <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[300px] overflow-scroll">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr className="text-left text-sm font-semibold text-gray-700">
                    <th className="px-4 py-3 w-12"></th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Species</th>
                    <th className="px-4 py-3">Breed</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3">Health State</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {petList.map((pet) => {
                    const selected = targetPet === pet.pet_id;

                    return (
                      <tr
                        key={pet.pet_id}
                        onClick={() => setTargetPet(pet.pet_id)}
                        className={`cursor-pointer transition ${selected ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="radio"
                            name="targetPet"
                            checked={selected}
                            value={pet.pet_id}
                            onChange={() => setTargetPet(pet.pet_id)}
                            className="accent-blue-600"
                          />
                        </td>

                        <td className="px-4 py-3 font-medium">{pet.pet_name}</td>

                        <td className="px-4 py-3">
                          {speciesOptions.find(
                            (item) => item.value === pet.species
                          )?.label}
                        </td>

                        <td className="px-4 py-3">{pet.breed}</td>
                        <td className="px-4 py-3">{pet.age}</td>
                        <td className="px-4 py-3 capitalize">{pet.gender}</td>

                        <td className="px-4 py-3">
                          {pet.health_state === "healthy" ? (
                            <Badge>Healthy</Badge>
                          ) : pet.health_state === "recovering" ? (
                            <Badge variant="secondary">Recovering</Badge>
                          ) : (
                            <Badge variant="destructive">Sick</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}