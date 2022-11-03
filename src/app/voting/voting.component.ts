import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { CandidatesService } from '../services/candidates.service';
import { Candidate } from '../models/candidate.model';
import { VotesService } from '../services/votes.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {


  groups: number[] = [];
  candidates!: any[];
  groupedCandidates: Candidate[][] = [];
  groupedVotedCandidates: number[] = [];;
  votesCount: number=0;
  candidatesCount: number = 0;


  constructor(private candidatesService: CandidatesService,private voteService:VotesService, private localStorageService:LocalStorageService) {

  }

  ngOnInit(): void {
    this.retrieveCandidates();
    this.voteService.getVotesCount().subscribe(count=>this.votesCount=count);

    if(this.localStorageService.getData('groupedVotedCandidates')!='')
      this.groupedVotedCandidates=JSON.parse(this.localStorageService.getData('groupedVotedCandidates'));
  }

  retrieveCandidates(): void {
    this.candidatesService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.candidates = data;
      this.candidatesCount = this.candidates.length;
      this.groupCandidates();

    });
  }
  groupCandidates(): void {
    this.groups = [];
    this.groupedCandidates = [];
    this.candidates.forEach(candidate => {
      if (!(this.groupedCandidates[candidate.group] instanceof Array)) {
        this.groupedCandidates[candidate.group] = [];
        this.groups.push(candidate.group);
      }
      this.groupedCandidates[candidate.group].push(candidate);
    });

    this.groups = this.groups.sort();
    
  }

  vote(candidate: Candidate) {
    if(this.groupedVotedCandidates[candidate.group] == undefined)
    {
      this.groupedVotedCandidates[candidate.group] = candidate.candidateID;
      //candidate.votes++;//not needed since the votes are updated in realtime once changed on the firestore DB
      this.candidatesService.addVote(candidate);
      this.voteService.vote(candidate.candidateID);
    }
    this.localStorageService.saveData('groupedVotedCandidates',JSON.stringify(this.groupedVotedCandidates));
  }

  getCandidateClass(group: number, id: number) {
    if (this.groupedVotedCandidates[group] != undefined) {
      return {
        elect: this.groupedVotedCandidates[group] === id,
        lost: this.groupedVotedCandidates[group] !== id,
      };
    }
    return '';
  }
}
