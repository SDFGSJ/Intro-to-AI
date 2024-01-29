#include<bits/stdc++.h>
using namespace std;

int N=8;
int attacking_pairs(vector<int>& state){
    int cnt=0;
    for(int i=0;i<N;i++){
        for(int j=i+1;j<N;j++){
            if(state[i]==state[j] || abs(state[i]-state[j])==abs(i-j)){
                cnt++;
            }
        }
    }
    return cnt;
}
void printans(vector<int>& v, int depth){
    printf("sol = [");
    for(auto i:v){
        printf("%d ",i);
    }
    printf("] found at depth %d\n",depth);
}
stack< pair<vector<int>, int> > s;
set<vector<int>> visited;
vector<int> v;
int main(){
    auto start = chrono::steady_clock::now();
    bool found_ans=false;
    int max_depth=1;
    while(!found_ans){
        while(!s.empty()){  //clear everything
            s.pop();
        }
        visited.clear();
        v.clear();

        printf("=====max depth = %d=====\n",max_depth);

        for(int i=0;i<N;i++){   //state of root node
            v.emplace_back(i);
        }

        s.emplace(v,1);
        visited.emplace(v);

        while(!s.empty()){
            auto [current_state, current_depth] = s.top();s.pop();

            int attacking_cnt=attacking_pairs(current_state);
            printf("attacking pairs = %d\n",attacking_cnt);
            if(attacking_cnt==0){   //find optimal sol
                found_ans=true;
                printans(current_state, current_depth);
                break;
            }

            if(current_depth<max_depth){    //generate child
                for(int i=0;i<N;i++){
                    for(int j=0;j<N;j++){
                        current_state[i]=j;
                        if(!visited.count(current_state)){
                            visited.emplace(current_state);
                            s.emplace(current_state, current_depth+1);
                        }
                    }
                }
            }
        }
        max_depth+=1;
    }
    auto end = chrono::steady_clock::now();
    auto diff = end - start;
    cout << chrono::duration<double>(diff).count() << " sec" << "\n";
    cout << "trials = " << visited.size() << "\n";
    return 0;
}