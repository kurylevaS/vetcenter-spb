import { getDoctorById } from '@/shared/api/doctors/getDoctorById';
import { Doctor } from '@/shared/api/doctors/getDoctors/types';
import { TeamBlock as TeamBlockType } from '@/shared/api/pages/main/types';
import TeamBlockClient from './TeamBlockClient';

interface ITeamBlockProps {
  teamBlock: TeamBlockType;
}

const TeamBlock = async ({ teamBlock }: ITeamBlockProps) => {
    console.log(teamBlock);
  if (!teamBlock?.team) {
    return 'null';
  }

  // Извлекаем ID из doctor объектов
  const doctorIds = teamBlock.team
    .map(teamMember => teamMember.doctor)
    .filter((id): id is number => typeof id === 'number');

  if (doctorIds.length === 0) {
    return null;
  }

  // Получаем данные для каждого врача через Promise.allSettled
  const doctorsResults = await Promise.allSettled(
    doctorIds.map(id => getDoctorById(id))
  );

  // Фильтруем успешные результаты
  const doctorsData = doctorsResults
    .filter((result): result is PromiseFulfilledResult<Doctor> => result.status === 'fulfilled')
    .map(result => result.value);

  if (doctorsData.length === 0) {
    return null;
  }

  return (
    <TeamBlockClient
      title={teamBlock.title}
      doctors={doctorsData}
    />
  );
};

export default TeamBlock;
