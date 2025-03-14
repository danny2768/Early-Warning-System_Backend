import { NetworkModel, StationModel, SensorModel, UserModel, ReadingModel, SubscriptionModel } from "../../data";
import { CustomError, NetworkEntity, SensorEntity, StationEntity, UserEntity } from "../../domain";


export class SharedService {

    public validateId( id: string, message: string = 'Invalid id' ) {
        if (id.length !== 24) throw CustomError.badRequest(message);
        const hexRegex = /^[0-9a-fA-F]+$/;
        if (!hexRegex.test(id)) throw CustomError.badRequest(message);
        return true;
    }

    public async validateNetworkById( id: string ): Promise<boolean> {        
        const network = await NetworkModel.exists({ _id: id });
        if (!network) throw CustomError.badRequest(`No network with id ${id} has been found`);

        return true;
    };

    public async validateStationById( id: string ): Promise<boolean> {        
        const station = await StationModel.exists({ _id: id });
        if (!station) throw CustomError.badRequest(`No station with id ${id} has been found`);
    
        return true;
    };

    public async validateStationHaveNetworkById( id: string ): Promise<StationEntity> {        
        const station = await StationModel.findById(id);
        if (!station) throw CustomError.badRequest(`No station with id ${id} has been found`);

        if (station.networkId) throw CustomError.badRequest(`Station ${id} already has a network`);
        
        return StationEntity.fromObj(station);
        
    };

    public async validateSensorById( id: string ): Promise<boolean> {        
        const sensor = await SensorModel.exists({ _id: id });
        if (!sensor) throw CustomError.badRequest(`No sensor with id ${id} has been found`);

        return true;
    };

    public async validateUserById( id: string ): Promise<boolean> {
        const user = await UserModel.exists({ _id: id });
        if (!user) throw CustomError.badRequest(`No user with id ${id} has been found`);
        
        return true;
    }

    public async validateNoStationAssociatedWithNetwork(networkId: string): Promise<boolean> {
        const associatedStationsCount = await StationModel.countDocuments({ networkId: networkId });
        if (associatedStationsCount > 0) {
            throw CustomError.badRequest(`Cannot delete network with id ${networkId} because it is referenced by one or more stations.`);
        }
        return true;
    }

    public async validateNoSensorAssociatedWithStation(stationId: string): Promise<boolean> {
        const associatedSensorsCount = await SensorModel.countDocuments({ stationId: stationId });
        if (associatedSensorsCount > 0) {
            throw CustomError.badRequest(`Cannot delete station with id ${stationId} because it is referenced by one or more sensors.`);
        }
        return true;
    }

    public async deleteReadingsBySensorId(sensorId: string): Promise<boolean> {
        await ReadingModel.deleteMany({ sensor: sensorId });
        return true;
    }

    public async removeStationFromSubscriptions(stationId: string): Promise<void> {
        await SubscriptionModel.updateMany(
            {}, // Filter for all documents
            { $pull: { stationIds: stationId } } // Pull (remove) the stationId from the stationIds array
        );
    }

    public async deleteSubscriptionsForUser(userId: string): Promise<void> {
        await SubscriptionModel.deleteMany({ userId: userId });
    }

    public async getUserById(id: string) {
        this.validateId(id);
        try {
            const user = await UserModel.findById(id);
            if (!user) throw CustomError.badRequest(`No user with id ${id} has been found`);
            
            const { password, ...userEntity } = UserEntity.fromObj(user);

            return userEntity;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);                        
        }

    }
}