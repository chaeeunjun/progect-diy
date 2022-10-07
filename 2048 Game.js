#include<stdio.h>
#include<time.h>
#include<conio.h>
#include<windows.h>
 
#define LEFT 75
#define RIGHT 77
#define UP 72
#define DOWN 80
 
int score=0; // 점수 
int board[4][4]={ // 게임판 
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0}
};
 
void draw(void); // 게임판을 그리는 함수 
void new_num(void); // 게임판에 2나 4를 만드는 함수 
void check_game_over(void); // 게임오버인지 체크 
 
main(){
    int i, j, r; //for문을 돌리기 위한 변수 
    int key; // 입력된 key값을 저장 
    int act; // key입력후 게임판에 변화가 있었는지 저장 
        
    new_num(); // 새로운 숫자를 만듦 
    new_num(); // 두개 만듦 
    draw(); // 게임화면을 그림 
    
    while(1){ 
        key=getch(); //키입력을 받음 
        if(key==0xE0||key==0){ //방향키의 경우 키입력시 0xE0+키값이 두개 전달됨 
            key=getch(); // 처음 0xE0은 버리고 두번째 키 값만을 판별 
            switch(key){
                case LEFT: //왼쪽 방향키 누른 경우 
                for(i=0,act=0;i<4;i++){ //모든 행 검사 
                    for(j=1;j<=3;j++){ // 1~3열 검사 
                        for(r=j;r>0;r--){ //j값을 r로 복사하여 값을 끝까지 밀어줌 
                            if(board[i][r]==0||board[i][r]>10000) break; //자기 값이 0 혹은 10000보다 큰 경우,
                            if(board[i][r-1]!=0&&board[i][r-1]!=board[i][r]) break;
                                                            //자기 왼쪽값이 0이 아니고 자신과 다른 경우 break;
                            if(board[i][r-1]==0) board[i][r-1]=board[i][r];    //자기 왼쪽값이 0인경우 자기값 복사
                            else if(board[i][r] == board[i][r-1]){ //자기 왼쪽값과 동일한 경우에
                                board[i][r-1]*=2; //왼쪽값을 2배로(자기 값을 더하는것과 같음) 
                                board[i][r-1]+=10000; // 임시로 값증가 함수 마지막에 다시 값을 감소시킴
                                score+=2*(board[i][r]); //점수를 증가 
                            }
                            board[i][r]=0;     //자기 값은 0으로 지움
                            act++; // action이 있음을 알림(get_key 함수 종료시 판단됨) 
                        }
                    }
                }
                break;
    
                case RIGHT: // 오른쪽 방향키를 누른경우. 작동원리는 동일 좌우만 바뀜 
                for(i=0,act=0;i<4;i++){ //모든 행 검사
                    for(j=2;j>=0;j--){ // 2~0열 검사
                        for(r=j;r<3;r++){
                            if(board[i][r]==0||board[i][r]>10000) break;
                            if(board[i][r+1]!=0&&board[i][r+1]!=board[i][r]) break;
                            if(board[i][r+1]==0) board[i][r+1]=board[i][r];
                            else if(board[i][r]==board[i][r+1]){
                                board[i][r+1]*=2;
                                board[i][r+1]+=10000;
                                score+=2*(board[i][r]);
                            }
                            board[i][r]=0;                            
                            act++;
                        }
                    }
                }
                break;
                    
                case UP: // 위쪽 방향키를 누른경우. 작동원리는 동일 
                for(j=0,act=0;j<4;j++){ //모든 열 검사
                    for(i=1;i<=3;i++){ // 1~3행 검사
                        for(r=i;r>0;r--){
                            if(board[r][j]==0||board[r][j]>10000) break;
                            if(board[r-1][j]!=0&&board[r-1][j]!=board[r][j]) break;
                            if(board[r-1][j]==0) board[r-1][j]=board[r][j];
                            else if(board[r][j]==board[r-1][j]){
                                board[r-1][j]*=2;
                                board[r-1][j]+=10000;
                                score+=2*(board[r][j]);
                            }
                            board[r][j]=0;
                            act++;
                        }
                    }
                }
                break;
    
                case DOWN:  // 아래쪽 방향키를 누른경우. 작동원리는 동일
                for(j=0,act=0;j<4;j++){ //모든 열 검사
                    for(i=2;i>=0;i--){ // 2~0행 검사
                        for(r=i;r<3;r++){
                            if(board[r][j]==0||board[r][j]>10000) break;
                            if(board[r+1][j]!=0&&board[r+1][j]!=board[r][j]) break;
                            if(board[r+1][j]==0) board[r+1][j]=board[r][j];
                            else if(board[r][j] == board[r+1][j]){
                                board[r+1][j]*=2;
                                board[r+1][j]+=10000;
                                score+=2*(board[r][j]);
                            }
                            board[r][j]=0;
                            act++;
                        }
                    }
                }
                break;
    
            }
        }
        
        for(i=0;i<4;i++){
            for(j=0;j<4;j++){
                if(board[i][j]>10000)
                    board[i][j]-=10000; //임시로 더한 10000을 감소 
            }
        }
        
        if(act>0){ //액션이 있었던 경우에만 
            new_num(); //새로운 숫자를 하나 생성 
            draw(); //게임판을 새로 그림 
            check_game_over(); //게임 오버를 체크  
        }
    }
}
 
void draw(void){
    int i,j;
    
    system("cls");
 
    for(i=0;i<4;i++){
        for(j=0;j<4;j++){
            if(board[i][j]==0) printf("    .");
            else printf("%5d", board[i][j]);
        }
        printf("\n");    
    }
    printf("\n");
    printf("Score : %d \n", score);
}
 
void new_num(void){
    int i, j;
    int cnt;
    int* p0[16]={0};
    
    for(i=0, cnt=0;i<4;i++){
        for(j=0;j<4;j++)
            if(board[i][j] == 0){
                p0[cnt]=&board[i][j];
                cnt++;
            }
    }
    
    *p0[rand()%(cnt)]=(rand()%100<80)?2:4;
}
 
void check_game_over(void){ //게임오버인지 체크 
    int i,j;
    
    for(i=0;i<4;i++) for(j=0;j<4;j++) if(board[i][j]==0) return;
    for(i=0;i<3;i++) for(j=0;j<3;j++) if(board[i][j]==board[i+1][j]||board[i][j]==board[i][j+1]) return;
    for(i=0;i<3;i++) if(board[i][3]==board[i+1][3]) return; 
    for(j=0;j<3;j++) if(board[3][j]==board[3][j+1]) return; 
    
    printf("Game Over..");
    exit(0);
}