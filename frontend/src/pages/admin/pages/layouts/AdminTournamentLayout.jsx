import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { tournamentService } from '../../../../services/admin/tournament_service';
import TournamentDetailsModal from '../tournament/AdminTournamentDetail';

function AdminTournamentLayout() {

  const [isSelectedTournament, setSelectedTournament] = useState(null);

  const publishMutation = useMutation({
    mutationKey: ['publish-tournament'],
    mutationFn: tournamentService.publishTournament
  })

  const onPublish = async (id) => {
    try {
      const res = await publishMutation.mutateAsync(id)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <main className="min-h-0 min-w-0 flex-1 overflow-hidden">

        <Outlet context={{
          isSelTournament: isSelectedTournament,
          setSelTournament: setSelectedTournament
        }} />
      </main>


      {isSelectedTournament && (
        <TournamentDetailsModal
          tournament={isSelectedTournament}
          onClose={() => setSelectedTournament(null)}
          onPublish={onPublish}
        />
      )}


    </section>
  )
}

export default AdminTournamentLayout