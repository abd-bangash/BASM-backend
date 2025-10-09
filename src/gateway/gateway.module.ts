import {Module} from "@nestjs/common";
import {TabletopGateway} from "./gateway";

@Module({
    providers: [TabletopGateway]
})
export class TabletopGatewayModule {}