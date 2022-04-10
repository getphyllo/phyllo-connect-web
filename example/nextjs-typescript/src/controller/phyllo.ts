import axios from "axios";
import { SdkToken } from "../@types/auth.type";
import { User } from "../@types/user.type";

export enum PHYLLO_FLOW_TYPES {
  POPUP = "POPUP",
  REDIRECT = "REDIRECT",
}

type PHYLLO_INTIALIZE_PROPS = {
  flowType: PHYLLO_FLOW_TYPES;
  clientDisplayName: string;
  workPlatformId?: string;
  userId: string;
};

export class PhylloController {
  private createConfig = async (
    userId: string,
    clientDisplayName: string,
    workPlatformId?: string,
    flowType: string
  ) => {
    //creating user
    const user: User = await axios
      .post("/api/users", { name: "Phyllo", externalId: userId })
      .then((r) => r.data)
      .catch(async (e) => {
        if (e.response.data.error_code == "user_exists_with_external_id") {
          return await axios
            .get("/api/users/", { params: { externalId: userId } })
            .then((r) => r.data);
        }
      });

    //creating a token
    const token: SdkToken = await axios
      .post("/api/sdk-token", { userId: user.id })
      .then((r) => r.data)
      .catch((e) => {
        throw new Error("Unable to create sdk token");
      });

      console.log(flowType, "Flow type")
    return {
      clientDisplayName: clientDisplayName,
      environment: process.env.NEXT_PUBLIC_ENV,
      userId: user.id,
      token: token.sdk_token,
      ...(flowType === PHYLLO_FLOW_TYPES.REDIRECT && { redirectURL: process.env.NEXT_PUBLIC_REDIRECT_URL }),
      redirect: flowType === PHYLLO_FLOW_TYPES.POPUP ?  false : true,
      workPlatformId: workPlatformId,
    };
  };

  public initialize = async ({
    flowType,
    clientDisplayName,
    workPlatformId,
    userId,
  }: PHYLLO_INTIALIZE_PROPS) => {
    const config = await this.createConfig(
      userId,
      clientDisplayName,
      workPlatformId,
      flowType
    );

    console.log(config)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const phylloConnect = PhylloConnect.initialize(config);
    if(flowType === PHYLLO_FLOW_TYPES.POPUP){
        this.registerCallbacks(phylloConnect);
    }
    phylloConnect.open();
  };

  private registerCallbacks = (handler: any) => {
    handler.on(
      "accountConnected",
      (accountId: string, workplatformId: string, userId: string) => {
        // gives the successfully connected account ID and work platform ID for the given user ID
        console.log(
          `onAccountConnected: ${accountId}, ${workplatformId}, ${userId}`
        );
      }
    );
    handler.on(
      "accountDisconnected",
      (accountId: string, workplatformId: string, userId: string) => {
        // gives the successfully disconnected account ID and work platform ID for the given user ID
        console.log(
          `onAccountDisconnected: ${accountId}, ${workplatformId}, ${userId}`
        );
      }
    );
    handler.on("tokenExpired", (userId: string) => {
      // gives the user ID for which the token has expired
      console.log(`onTokenExpired: ${userId}`); // the SDK closes automatically in case the token has expired, and you need to handle this by showing an appropriate UI and messaging to the users
    });
    handler.on("exit", (reason: string, userId: string) => {
      // indicated that the user with given user ID has closed the SDK and gives an appropriate reason for it
      console.log(`onExit: ${reason}, ${userId}`);
    });
  };

  public fetchWorkPlatforms = async () => {
    return await axios.get("/api/work-platforms").then(r=>r.data);
  };
}
